import { Controller, Post, Get, Put, RequestValidator } from '@Controller/decorators'
import { type Request, type Response } from 'express'
import { UserModel } from '@src/models/users.model'
import { createUserRequest, findDataRequest, updateUserRequest } from './user.request'

@Controller('/User')
export class UserController {
  private readonly User = new UserModel()
  @Get('/', false)
  @RequestValidator(findDataRequest)
  find(req: Request, res: Response): any {
    const data: { code: string, username: string, email: string, firstName: string, lastName: string } = req.query as { code: string, username: string, email: string, firstName: string, lastName: string }
    this.User.find(data, res)
  }

  @Post('/', false)
  @RequestValidator(createUserRequest)
  async create(req: Request, res: Response): Promise<any> {
    this.User.create(req.body, res)
  }

  @Put('/:code', false)
  @RequestValidator(updateUserRequest)
  async update(req: Request, res: Response): Promise<any> {
    this.User.update({ ...req.body, code: req.params.code }, res)
  }

}
