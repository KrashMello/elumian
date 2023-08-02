import { Controller, Get, Post } from '@Controller/decorators'
import { Request, Response } from 'express'
import { cacheList } from '@Cache/index'
@Controller('/api/Auth')
export class AuthController {
  @Get('/', false)
  async get(_req: Request, res: Response) {
    return res.json(cacheList)
  }
  @Post('/', false)
  async create(_req: Request, res: Response) {
    console.log(_req.params)
    return res.json({})
  }
}
