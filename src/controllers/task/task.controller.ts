import { Controller, Get, Post } from '@Controller/decorators'
import { Request, Response } from 'express'
import { TaskModel } from '@src/models/task.model'
@Controller('/api/tasks')
export class TaskController {
  private readonly task = new TaskModel()

  @Get('/', false)
  async get (_req: Request, res: Response) {
    const result = await this.task.findAll()
    return res.json(result)
  }

  @Get('/:id', false)
  async getOne (req: Request, res: Response) {
    const { id } = req.params
    if (id) res.json(await this.task.findOne(id))
    else res.send('id no existe')
  }

  @Post('/', false)
  async create (_req: Request, res: Response) {
    return res.send('agregar tarea')
  }
}
