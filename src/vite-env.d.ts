/// <reference types="vite/client" />

declare module '*?raw' {
  const content: string
  export default content
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
  }
}

declare const process: {
  env: NodeJS.ProcessEnv
}
