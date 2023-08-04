import { Controller, Post } from '@Controller/decorators'
import { AuthModel } from '@src/models/Auth.model'
import { Request, Response } from 'express'
import { signInRequest } from './Auth.request'
@Controller('/Auth')
export class AuthController {
  private Auth = new AuthModel()

  @Post('/signIn', false)
  async signIn(req: Request, res: Response) {
    let validate = signInRequest.validate(req.body)
    if (validate !== true) return res.status(403).json(validate)

    return this.Auth.signIn(req.body, res)
  }

  @Post('/signUp', false)
  async create(req: Request, res: Response) {
    this.Auth.signUp(req.body, res)
  }
}
