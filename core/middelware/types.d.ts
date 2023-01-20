import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface RequestJWT extends Request {
  userId: string | JwtPayload;
}
