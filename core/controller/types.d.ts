export type Methods = "get" | "post" | "delete" | "options" | "put";

export interface IRouter {
  method: Methods;
  path: string;
  withMiddelware: boolean;
  handlerName: string;
}
