/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENT_REGISTRY_ADDRESS: string;
  readonly VITE_COPY_TRADE_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}