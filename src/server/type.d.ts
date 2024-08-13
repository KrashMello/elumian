export interface ServerConfig {
  controllers: any[];
  services: any[];
  whiteList?: string[];
  port?: number;
}
export * from "./request/type";
export * from "./router/type";
