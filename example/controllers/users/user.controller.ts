import {
  Controller,
  Post,
  Get,
  Put,
  RequestValidator,
} from "elumian/decorators";
import { type Request, type Response } from "express";
import {
  createUserRequest,
  findDataRequest,
  updateUserRequest,
} from "./user.request";
import { Elumian } from "elumian";

@Controller("/user")
export class UserController {
  @Get("/logisfn", false)
  auth(_req: Request, res: Response): any {
    res.send(`
    <script>
      window.open('https://github.com/login/oauth/authorize?client_id=f75b6d2a8dcd95e5d4e8', '_blank');
    </script>
    `);
  }

  @Get("/", false)
  @RequestValidator(findDataRequest)
  async find(req: Request, res: Response): Promise<any> {
    try {
      const elumian = Elumian.getInstance();
      let searchFilter = "";
      if (req.query.searchFilter)
        searchFilter = req.query.searchFilter as string;
      res.json(await elumian.user.findAll(searchFilter));
    } catch (e) {
      console.log(e);
    }
  }

  @Post("/", false)
  @RequestValidator(createUserRequest)
  async create(req: Request, res: Response): Promise<any> {
    try {
      const elumian = Elumian.getInstance();
      const data = req.body;
      res.json(await elumian.user.create(data));
    } catch (e) {
      console.log(e);
    }
  }

  @Put("/:id", false)
  @RequestValidator(updateUserRequest)
  async update(req: Request, res: Response): Promise<any> {
    try {
      const elumian = Elumian.getInstance();
      let data = req.body;
      data = { ...data, id: Number(req.params.id) };
      res.json(await elumian.user.update(data));
    } catch (e) {
      console.log(e);
    }
  }
}
