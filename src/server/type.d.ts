export interface ServerConfig {
  controllers: any[];
  services: any[];
  whiteList?: string[];
  port?: number;
}
export * from "./router/type";
