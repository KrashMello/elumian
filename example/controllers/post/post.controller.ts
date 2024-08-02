import {
  Controller,
  Post,
  Get,
  Put,
  RequestValidator,
} from "elumian/decorators";
import { type Request, type Response } from "express";
import {
  createPostRequest,
  findDataRequest,
  updatePostRequest,
} from "./post.request";
import { Elumian } from "elumian";

@Controller("/post")
export class PostController {
  @Get("/", false)
  @RequestValidator(findDataRequest)
  async find(_req: Request, res: Response): Promise<any> {
    const elumian = Elumian.getInstance();
    res.json(await elumian.post.findAll());
  }

  @Post("/", false)
  @RequestValidator(createPostRequest)
  async create(_req: Request, res: Response): Promise<any> {
    const elumian = Elumian.getInstance();
    res.json(await elumian.post.create());
  }

  @Put("/:id", false)
  @RequestValidator(updatePostRequest)
  async update(_req: Request, res: Response): Promise<any> {
    const elumian = Elumian.getInstance();
    res.json(await elumian.post.update());
  }
}
