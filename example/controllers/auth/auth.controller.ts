import { Controller, Post, DataEntryGuard } from "@elumian/decorators";
import { type Request, type Response } from "express";
import { loginDataRequest } from "./auth.request";
import { Elumian } from "@elumian";
@Controller("/auth")
export class AuthController {
  @Post("/login", false)
  @DataEntryGuard(loginDataRequest)
  async login(req: Request, res: Response): Promise<any> {
    try {
      const data = req.body;
      res.json(await Elumian.Auth.login(data));
    } catch (e: any) {
      console.log(e.message);
      res.status(401).json({
        type: "warning",
        message: "Ocurrio un error",
      });
    }
  }

  // @Post("/logout", false)
  // @RequestValidator(loginDataRequest)
  // async logout(req: Request, res: Response): Promise<any> {
  //   try {
  //     const elumian = Elumian.getInstance();
  //     const data = req.body;
  //     res.json(await elumian.user.create(data));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}
