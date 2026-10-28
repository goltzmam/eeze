import { describe, it, expect, vi, afterEach } from "vitest";
import {
  ReadOnlyBluetoothAdapter,
  connectionError,
} from "../src/integrations/wearables/web-bluetooth";
afterEach(() => vi.unstubAllGlobals());
describe("official connection safety", () => {
  it("does not offer unsupported Web Bluetooth", async () => {
    const adapter = new ReadOnlyBluetoothAdapter();
    expect(await adapter.isSupported()).toBe(false);
    await expect(adapter.connect()).rejects.toMatchObject({
      code: "UNSUPPORTED",
    });
  });
  it("never claims synchronization for an unverified protocol", async () => {
    const a = new ReadOnlyBluetoothAdapter();
    expect(await a.getCapabilities()).toEqual({
      metrics: [],
      history: false,
      protocolVerified: false,
    });
    await expect(a.sync()).rejects.toMatchObject({
      code: "PROTOCOL_UNVERIFIED",
    });
  });
  it("reads only assigned standard services; connection is not protocol verification", async () => {
    const services = vi.fn().mockResolvedValue([]);
    const server = {
      connect: vi.fn(),
      disconnect: vi.fn(),
      getPrimaryServices: services,
      getPrimaryService: vi.fn().mockRejectedValue(new Error("not available")),
    };
    server.connect.mockResolvedValue(server);
    const device = new EventTarget() as EventTarget & {
      id: string;
      name: string;
      gatt: typeof server;
    };
    Object.assign(device, {
      id: "technical-fixture",
      name: "fixture",
      gatt: server,
    });
    const requestDevice = vi.fn().mockResolvedValue(device);
    vi.stubGlobal("navigator", { bluetooth: { requestDevice } });
    vi.stubGlobal("window", { isSecureContext: true });
    const disconnected = vi.fn();
    const adapter = new ReadOnlyBluetoothAdapter(disconnected);
    const result = await adapter.connect();
    expect(result.battery).toBeUndefined();
    expect(result.model).toBeUndefined();
    expect(requestDevice).toHaveBeenCalledWith({
      acceptAllDevices: true,
      optionalServices: ["device_information", "battery_service"],
    });
    device.dispatchEvent(new Event("gattserverdisconnected"));
    expect(disconnected).toHaveBeenCalled();
    await adapter.disconnect();
    expect(server.disconnect).toHaveBeenCalled();
  });
  it("handles denied permission, no selection and disconnect errors", () => {
    expect(connectionError(new DOMException("", "NotAllowedError"))).toContain(
      "negada",
    );
    expect(connectionError(new DOMException("", "NotFoundError"))).toContain(
      "selecionada",
    );
    expect(connectionError(new DOMException("", "NetworkError"))).toContain(
      "interrompida",
    );
  });
});
