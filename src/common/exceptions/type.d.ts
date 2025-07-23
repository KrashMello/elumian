import { HttpStatus } from "./http.exception";
export interface HttpExceptionOptions {
  status: HttpStatus,
  message: any,
  type: 'WARNING' | 'INFO' | 'DANGER' | 'SUCCESS'
}
