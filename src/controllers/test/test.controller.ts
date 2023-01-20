import { ControllerClass } from "@Controller/index";
import { Controller, Get } from "@Controller/decorators";
import { Request, Response } from "express";
@Controller("/api")
export class Test extends ControllerClass {
  constructor() {
    super();
  }

  @Get("", false)
  get(_req: Request, res: Response) {
    res.status(200).json({ message: "hola Mundo! desde test" });
  }
}
