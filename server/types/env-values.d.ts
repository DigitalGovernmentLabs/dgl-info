declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?: "development" | "production" | "test";
    readonly CORS_ORIGIN?: string;
    readonly TYPEORM_HOST?: string;
    readonly TYPEORM_USERNAME?: string;
    readonly TYPEORM_PASSWORD?: string;
    readonly TYPEORM_DATABASE?: string;
    readonly TYPEORM_PORT?: string;
    readonly API_JWT_SECRET?: string;
    readonly API_SERVER_PORT?: string;
    readonly API_BASE_PATH?: string;
    readonly API_COOKIE_SECRET?: string;
    readonly FIRST_ROOT_PASSWORD?: string;
  }
}
