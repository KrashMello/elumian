import { Model } from '@Model/index'
// import { Cache } from '@Cache/index'
import { type Response } from 'express'

export class UserModel extends Model {
  schemaName = 'system'
  tableName = 'Users'
  constructor() {
    super()
    this.init()
  }

  find(
    data: {
      code: string
      username: string
      email: string
      firstName: string
      lastName: string
    },
    resp: Response
  ): any {
    const { code, username, email, lastName, firstName } = data
    this.DB.view('*', `"system"."Users"`)
      .where([
        `"code"::text like '%${code}%'`,
        `"username" like '%${username}%'`,
        `"email" like '%${email}%'`,
        `"first_name" like '%${firstName}%'`,
        `"last_name" like '%${lastName}%'`,
      ])
      .exec()
      .then((res: any) => {
        return resp.status(200).json(res.rows)
      })
      .catch((error: any) => {
        console.log(error)
        return resp.status(401).json({ message: 'ah ocurrido un error' })
      })
  }

  create(
    data: {
      username: string
      password: string
      firstName: string
      lastName: string
      email: string
      statusCode: string
      roleCode: string
    },
    resp: Response
  ): any {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      statusCode,
      roleCode,
    } = data
    this.DB.call(
      '"createUser"',
      `'${username}'::varchar, '${password}'::varchar, '${firstName}'::varchar, '${lastName}'::varchar, '${email}'::varchar, '${statusCode}'::varchar, '${roleCode}'::varchar`
    )
      .exec()
      .then((_res: any) => {
        return resp.status(200).json({ message: 'tarea creada' })
      })
      .catch((error: any) => {
        console.log(error)
        return resp.status(401).json({ message: 'ah ocurrido un error!' })
      })
  }

  update(
    data: { code: string; firstName: string; lastName: string },
    resp: Response
  ): any {
    const { code, firstName, lastName } = data
    this.DB.call(
      '"updateUser"',
      `'${code}'::varchar, '${firstName}'::varchar, '${lastName}'::varchar`
    )
      .exec()
      .then((_res: any) => {
        return resp.status(200).json({ message: 'tarea actualizada' })
      })
      .catch((error: any) => {
        console.log(error)
        return resp.status(401).json({ message: 'ah ocurrido un error!' })
      })
  }
}
