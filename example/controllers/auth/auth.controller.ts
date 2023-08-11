import { Controller, Post, Get, RequestValidator } from '@Controller/decorators'
import { AuthModel } from '@src/models/Auth.model'
import { type Request, type Response } from 'express'
import { signInRequest } from './Auth.request'
@Controller('/Auth')
export class AuthController {
  private readonly Auth = new AuthModel()
  @Get('/', false)
  all(_re: Request, res: Response): Response {
    return res.json({ h: 'hola' })
  }

  @Post('/signIn', false)
  @RequestValidator(signInRequest.validate())
  async signIn(_req: Request, res: Response): Promise<any> {
    return res.json({ a: 'all done' })
    // return this.Auth.signIn(req.body, res)
  }

  @Post('/signUp', false)
  async create(req: Request, res: Response): Promise<any> {
    this.Auth.signUp(req.body, res)
  }
}
