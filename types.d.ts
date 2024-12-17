// globals.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASIC_FETCH_URL: string;
    }
  }
  }

export {};
