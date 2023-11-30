import type { NextFunction, Request, Response } from 'express';
export declare function router(controllers: any, app: any, io: any, Middelware?: (req: Request, res: Response, next: NextFunction) => Response): any;
