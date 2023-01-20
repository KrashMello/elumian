import { Request, Response } from "express";
import { Get, Controller, Post, Put } from "./decorators";
@Controller("/test")
export abstract class ControllerClass {
  @Get("")
  get(_req: Request, _res: Response) {}

  @Post("")
  create(_req: Request, _res: Response) {}

  @Put("")
  update(_req: Request, _res: Response) {}
}
