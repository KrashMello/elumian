import {
  Controller,
  Post,
  Get,
  Put,
  RequestValidator,
} from "@elumian/decorators";
import { type Request, type Response } from "express";
import {
  createUserRequest,
  findDataRequest,
  updateUserRequest,
} from "./user.request";
import { Elumian } from "@elumian";

@Controller("/user")
export class UserController {
  @Get("/", false)
  @RequestValidator(findDataRequest)
  async find(_req: Request, res: Response): Promise<any> {
    const elumian = Elumian.getInstance();
    res.json(await elumian.user.findAll());
  }
}
