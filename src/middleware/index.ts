import { type NextFunction, type Response, type Request } from "express";
import { Elumian } from "..";

function verifyToken(req: Request, res: Response, next: NextFunction): any {
  const id = req.header("x-access-id");

  if (id == null) {
    return res.status(403).send({
      error: "warning",
      message: "No token provided!",
    });
  }
  if (Elumian.cache.verifyId("Auth", id) === false)
    return res.status(401).json({
      error: "warning",
      message: "Unauthorized!",
    });
  next();
}
export default verifyToken;
