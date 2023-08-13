import { Controller, Post, Get, Put, RequestValidator, Delete } from '@Controller/decorators'
import { type Request, type Response } from 'express'
import { TaskModel } from '@src/models/task.model'
import { createTaskRequest, findDataRequest, updateTaskRequest } from './task.request'
@Controller('/Task')
export class TaskController {
  private readonly Task = new TaskModel()
  @Get('/', false)
  @RequestValidator(findDataRequest)
  find(req: Request, res: Response): any {
    const data: { code: string, name: string, description: string } = req.query as { code: string, name: string, description: string }
    this.Task.find(data, res)
  }

  @Post('/', false)
  @RequestValidator(createTaskRequest)
  async create(req: Request, res: Response): Promise<any> {
    this.Task.create(req.body, res)
  }

  @Put('/:code', false)
  @RequestValidator(updateTaskRequest)
  async update(req: Request, res: Response): Promise<any> {
    this.Task.update({ ...req.body, code: req.params.code }, res)
  }

  @Delete('/:code', false)
  async delete(req: Request, res: Response): Promise<any> {
    this.Task.delete({ code: req.params.code as string }, res)
  }
}
