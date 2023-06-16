import { Controller, Get, Post } from '@Controller/decorators'
import { Request, Response } from 'express'
import { TaskModel } from '@src/models/task.model'
import { taskCreateValidator } from './request.validatorRequest'
@Controller('/api/tasks')
export class TaskController {
  private task = new TaskModel()

  @Get('/', false)
  async get(_req: Request, res: Response) {
    let result = await this.task.findAll()
    return res.json(result)
  }

  @Get('/:id', false)
  async getOne(req: Request, res: Response) {
    let { id } = req.params
    if (id) res.json(await this.task.findOne(id))
    else res.send('id no existe')
  }

  @Post('/', false)
  async create(req: Request, res: Response) {
    let result: { status: number; message: string } = {
      status: 1,
      message: 'error',
    }
    let validate = taskCreateValidator.getResult(req.body.params)

    if (Object.values(validate).length === 0) {
      let { name, description } = req.body.params
      await this.task
        .create([
          `'${name}'::character varying`,
          `'${description}'::character varying`,
        ])
        .then(() => {
          result = { status: 0, message: 'tarea agregada exitosamente' }
        })
        .catch((error: any) => {
          console.log(error)
          result = { status: 1, message: error }
        })
    } else {
      result = { status: 1, message: validate }
    }

    return res.status(result.status === 1 ? 401 : 200).json(result)
  }
}
