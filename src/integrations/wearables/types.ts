export type DeviceState =
  | "idle"
  | "requesting"
  | "connecting"
  | "connected_unverified"
  | "disconnected"
  | "error";
export interface DeviceCapabilities {
  metrics: string[];
  history: boolean;
  protocolVerified: boolean;
}
export interface DeviceIdentity {
  id: string;
  name: string | null;
  manufacturer?: string;
  model?: string;
  firmware?: string;
  battery?: number;
  services: string[];
}
export interface SyncResult {
  received: number;
  stored: number;
  duplicates: number;
  partial: boolean;
}
export interface WearableAdapter {
  id: string;
  name: string;
  isSupported(): Promise<boolean>;
  connect(): Promise<DeviceIdentity>;
  disconnect(): Promise<void>;
  getCapabilities(): Promise<DeviceCapabilities>;
  sync(): Promise<SyncResult>;
}
export class WearableError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
