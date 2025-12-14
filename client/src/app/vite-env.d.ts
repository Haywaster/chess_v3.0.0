/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_SERVER_DEV: string
  readonly VITE_APP_SERVER_PROD: string
  readonly VITE_SERVER_URL: string
  readonly VITE_WS_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
