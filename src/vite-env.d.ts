/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'true' esetén minden ajtó nyitható (helyi fejlesztés, Netlify-előnézet). */
  readonly VITE_UNLOCK_ALL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
