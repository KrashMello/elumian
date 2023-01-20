import { ControllerClass } from "@Controller/index";
import { Controller, Get, Post } from "@Controller/decorators";
import { Request, Response } from "express";
import { testValidate } from "./request.validatorRequest";
@Controller("/api")
export class Test extends ControllerClass {
  constructor() {
    super();
  }

  @Get("", false)
  get(_req: Request, res: Response) {
    res.status(200).json({ message: "hola Mundo! desde test" });
  }

  @Post("", false)
  create(req: Request, res: Response) {
    let validate = testValidate.getResult(req.body.params);
    if (Object.values(validate).length === 0) {
      return res.status(200).json("validado correctamente");
    } else {
      return res.status(401).json(validate);
    }
  }
}
