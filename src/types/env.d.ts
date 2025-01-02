/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add typed environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}