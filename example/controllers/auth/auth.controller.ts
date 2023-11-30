import { Controller, Post, RequestValidator } from '@Controller/decorators'
import { AuthModel } from '@src/models/Auth.model'
import { type Request, type Response } from 'express'
import { signInRequest, signUpRequest } from './Auth.request'

@Controller('/Auth')
export class AuthController {
  private readonly Auth = new AuthModel()

  @Post('/signIn', false)
  @RequestValidator(signInRequest)
  async signIn(req: Request, res: Response): Promise<any> {
    this.Auth.signIn(req.body, res)
  }

  @Post('/signUp', false)
  @RequestValidator(signUpRequest)
  async create(req: Request, res: Response): Promise<any> {
    this.Auth.signUp(req.body, res)
  }
}
