import { type Request } from 'express'
import { type JwtPayload } from 'jsonwebtoken'
export interface RequestJWT extends Request {
  userId: string | JwtPayload
}
