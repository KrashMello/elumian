import { type NextFunction, type Response, type Request } from 'express';
declare function verifyToken(req: Request, res: Response, next: NextFunction): any;
export default verifyToken;
