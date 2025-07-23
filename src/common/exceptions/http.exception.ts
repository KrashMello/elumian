import { HttpExceptionOptions } from "./type"

export enum HttpStatus {
  created = 201,
  ok = 200,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
  internalServerError = 500,
  notImplemented = 501,
  badGateway = 502,
  serviceUnavailable = 503,
}

export const HttpExceptions = (opt: HttpExceptionOptions) => {
  let { status, message, type } = opt
  status = status || HttpStatus.internalServerError
  type = type || 'DANGER'
  console.error(`${type}: ${JSON.stringify(message)}`)
  throw {
    status,
    data: {
      message,
      type
    }
  }
}
