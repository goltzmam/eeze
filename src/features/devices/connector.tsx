"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Watch, Bluetooth, ShieldCheck, RefreshCw } from "lucide-react";
import {
  ReadOnlyBluetoothAdapter,
  connectionError,
} from "@/integrations/wearables/web-bluetooth";
import type {
  DeviceState,
  DeviceIdentity,
} from "@/integrations/wearables/types";
export function DeviceConnector({ enabled }: { enabled: boolean }) {
  const [state, setState] = useState<DeviceState>("idle"),
    [identity, setIdentity] = useState<DeviceIdentity | null>(null),
    [message, setMessage] = useState(""),
    [permission, setPermission] = useState(false);
  const adapter = useRef<ReadOnlyBluetoothAdapter | null>(null);
  async function connect() {
    setMessage("");
    if (!adapter.current)
      adapter.current = new ReadOnlyBluetoothAdapter(() => {
        setState("disconnected");
        setMessage(
          "A pulseira foi desconectada. Nenhuma sincronização foi concluída.",
        );
      });
    try {
      setState("requesting");
      const result = await adapter.current.connect();
      setIdentity(result);
      setState("connected_unverified");
    } catch (e) {
      await adapter.current.disconnect();
      setState("error");
      setMessage(connectionError(e));
    }
  }
  return (
    <div className="device-flow">
      <div className="device-visual">
        <div className="device-halo" />
        <Watch size={100} strokeWidth={0.7} />
        <span className="pill">
          <Bluetooth size={13} />
          {state === "connected_unverified"
            ? "GATT conectado · protocolo não confirmado"
            : "Conexão com presença"}
        </span>
      </div>
      <div className="device-copy">
        <p className="eyebrow">MINHA eaze</p>
        <h1>Conecte sua eaze.</h1>
        <p className="subheading">
          Vincule sua pulseira para acompanhar seus indicadores e construir seu
          histórico.
        </p>
        <div className="notice">
          <ShieldCheck size={20} />
          <span>
            A compatibilidade da pulseira está em validação. É possível tentar a
            identificação por Bluetooth; vinculação e sincronização ainda não
            estão disponíveis.
          </span>
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={permission}
            onChange={(e) => setPermission(e.target.checked)}
          />
          Permito a identificação por Bluetooth e a leitura das informações
          padrão disponíveis.
        </label>
        <button
          className="button"
          onClick={connect}
          disabled={
            !enabled ||
            !permission ||
            state === "requesting" ||
            state === "connecting" ||
            state === "connected_unverified"
          }
        >
          <Bluetooth size={17} />
          {state === "requesting"
            ? "Aguardando seleção…"
            : "Conectar minha eaze"}
        </button>
        {!enabled && (
          <Link className="text-link" href="/entrar">
            Entre na sua conta para conectar
          </Link>
        )}
        <p role="status" className="form-message">
          {message}
        </p>
        {identity && (
          <div className="identity">
            <h3>{identity.name || "Nome não disponibilizado"}</h3>
            <dl>
              {[
                ["Modelo", identity.model],
                ["Fabricante", identity.manufacturer],
                ["Firmware", identity.firmware],
                [
                  "Bateria",
                  identity.battery !== undefined
                    ? identity.battery + "%"
                    : undefined,
                ],
                ["Protocolo", "Não confirmado"],
                ["Última sincronização", "Nenhuma"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v || "Não disponibilizado"}</dd>
                </div>
              ))}
            </dl>
            <button
              className="text-button"
              onClick={async () => {
                try {
                  await adapter.current?.sync();
                } catch (e) {
                  setMessage((e as Error).message);
                }
              }}
            >
              <RefreshCw size={16} />
              Verificar sincronização
            </button>
            <button
              className="text-button"
              onClick={async () => {
                await adapter.current?.disconnect();
                setState("disconnected");
                setIdentity(null);
              }}
            >
              Desconectar
            </button>
          </div>
        )}
        <div className="compatibility">
          <h3>Por perto. E no navegador certo.</h3>
          <p>
            Web Bluetooth requer HTTPS e um navegador compatível, como Chrome no
            Android. O Safari do iPhone não oferece esse recurso. Ainda não há
            API de fabricante validada para sincronização no iPhone.
          </p>
        </div>
      </div>
    </div>
  );
}
