import { Model } from '@Model/index'
import { type Response } from 'express'

export class TaskModel extends Model {
  schemaName = 'task'
  tableName = 'tasks'
  constructor() {
    super()
    this.initBD()
  }

  find(data: { code: string, name: string, description: string }, resp: Response): any {
    const { code, name, description } = data
    this.DB.view("*", `"allTasks"`).where([
      `"code"::text like '%${code}%'`,
      `"name" like '%${name}%'`,
      `"description" like '%${description}%'`
    ]).exec().then((res: any) => {
      return resp.status(200).json(res.rows)
    }).catch((error: any) => {
      console.log(error)
      return resp.status(401).json({ message: "ah ocurrido un error" })
    })
  }

  findWhitSocket(io: any, socket: any): any {
    setInterval(() => {
      this.DB.view("*", `"allTasks"`).exec().then((resp: any) => {
        io.to(socket.id).emit("/Task:get", resp.rows)
      })
    }, 1000);
  }


  create(data: { name: string, description: string }, resp: Response): any {
    const { name, description } = data
    this.DB.call('"createTask"', `'${name}'::varchar, '${description}'::text`).exec().then((_res: any) => {
      return resp.status(200).json({ message: "tarea creada" })
    }).catch((error: any) => {
      console.log(error)
      return resp.status(401).json({ message: "ah ocurrido un error!" })
    })
  }

  update(data: { name: string, description: string, code: string }, resp: Response): any {
    const { name, description, code } = data
    this.DB.call('updatetask', `'${code}'::varchar, '${name}'::varchar, '${description}'::text`).exec().then((_res: any) => {
      return resp.status(200).json({ message: "tarea actualizada" })
    }).catch((error: any) => {
      console.log(error)
      return resp.status(401).json({ message: "ah ocurrido un error!" })
    })
  }

}
