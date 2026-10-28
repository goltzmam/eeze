import {
  WearableError,
  type WearableAdapter,
  type DeviceIdentity,
  type DeviceCapabilities,
  type SyncResult,
} from "./types";
// Bluetooth SIG assigned names only. No proprietary services or writes.
interface Characteristic {
  readValue(): Promise<DataView>;
}
interface Service {
  uuid: string;
  getCharacteristic(name: string): Promise<Characteristic>;
}
interface Server {
  connected: boolean;
  connect(): Promise<Server>;
  disconnect(): void;
  getPrimaryServices(): Promise<Service[]>;
  getPrimaryService(name: string): Promise<Service>;
}
interface Device extends EventTarget {
  id: string;
  name?: string;
  gatt?: Server;
}
interface Bluetooth {
  requestDevice(options: {
    acceptAllDevices: boolean;
    optionalServices: string[];
  }): Promise<Device>;
}
function bluetooth() {
  return (navigator as Navigator & { bluetooth?: Bluetooth }).bluetooth;
}
export function connectionError(error: unknown) {
  if (error instanceof WearableError) return error.message;
  if (error instanceof DOMException) {
    if (error.name === "NotFoundError")
      return "Nenhuma pulseira foi selecionada. Tente novamente quando estiver por perto.";
    if (error.name === "NotAllowedError" || error.name === "SecurityError")
      return "Permissão Bluetooth negada. Verifique as permissões do navegador.";
    if (error.name === "NetworkError")
      return "A conexão foi interrompida. Aproxime a pulseira e feche outros aplicativos conectados.";
  }
  return "Não foi possível conectar. Verifique o Bluetooth e tente novamente.";
}
export class ReadOnlyBluetoothAdapter implements WearableAdapter {
  id = "web-bluetooth-identification";
  name = "Identificação Bluetooth";
  private device?: Device;
  constructor(private onDisconnect: () => void = () => {}) {}
  async isSupported() {
    return (
      typeof navigator !== "undefined" &&
      typeof window !== "undefined" &&
      window.isSecureContext &&
      Boolean(bluetooth())
    );
  }
  async connect(): Promise<DeviceIdentity> {
    if (!(await this.isSupported()))
      throw new WearableError(
        "UNSUPPORTED",
        "Este navegador não oferece Web Bluetooth. No iPhone, a conexão da pulseira ainda depende de uma integração externa validada.",
      );
    this.device = await bluetooth()!.requestDevice({
      acceptAllDevices: true,
      optionalServices: ["device_information", "battery_service"],
    });
    this.device.addEventListener("gattserverdisconnected", this.onDisconnect);
    if (!this.device.gatt)
      throw new WearableError(
        "NO_GATT",
        "O dispositivo não disponibilizou uma conexão GATT.",
      );
    const server = await this.device.gatt.connect();
    const identity: DeviceIdentity = {
      id: this.device.id,
      name: this.device.name || null,
      services: (await server.getPrimaryServices()).map((s) => s.uuid),
    };
    try {
      const info = await server.getPrimaryService("device_information");
      for (const [field, char] of [
        ["manufacturer", "manufacturer_name_string"],
        ["model", "model_number_string"],
        ["firmware", "firmware_revision_string"],
      ] as const) {
        try {
          const value = await (await info.getCharacteristic(char)).readValue();
          identity[field] = new TextDecoder()
            .decode(value)
            .replace(/\0/g, "")
            .slice(0, 120);
        } catch {
          /* Optional characteristic unavailable. */
        }
      }
    } catch {
      /* Optional SIG service unavailable. */
    }
    try {
      const service = await server.getPrimaryService("battery_service");
      const value = await (
        await service.getCharacteristic("battery_level")
      ).readValue();
      const level = value.getUint8(0);
      if (level <= 100) identity.battery = level;
    } catch {
      /* Battery is optional. */
    }
    return identity;
  }
  async disconnect() {
    this.device?.gatt?.disconnect();
    this.device?.removeEventListener(
      "gattserverdisconnected",
      this.onDisconnect,
    );
    this.device = undefined;
  }
  async getCapabilities(): Promise<DeviceCapabilities> {
    return { metrics: [], history: false, protocolVerified: false };
  }
  async sync(): Promise<SyncResult> {
    throw new WearableError(
      "PROTOCOL_UNVERIFIED",
      "A conexão GATT não confirma o protocolo eaze. A sincronização permanece indisponível até validação com hardware físico.",
    );
  }
}
