import { getCacheDataById, singCacheData } from '@Cache/index'
import { Model } from '@Model/index'
import bcrypt from 'bcrypt'
import { type Response } from 'express'

export class AuthModel extends Model {
  private readonly cacheKey: string = 'Auth'
  schemaName = 'system'
  tableName = 'Users'
  constructor() {
    super()
    this.initBD()
  }

  public signIn(
    data: { username: string, password: string },
    resp: Response
  ): any {
    const { username, password } = data
    const fields = ['username', 'first_name', '"last_name"', 'password']
    let userData: any
    this.DB.view(fields, 'user_view')
      .where([`"username" = '${username}'`])
      .exec().then((res: any) => {
        if (res.rowCount === 0)
          return resp.status(401).json({ message: "usuario invalido" })
        userData = res.rows[0]
        if (!bcrypt.compareSync(password, userData.password as string)) {
          return resp.status(401).json({
            message: 'contraseña invalida'
          })
        }
        return resp.status(200).json(singCacheData(this.cacheKey, userData))
      }).catch((error: any) => {
        console.log(error)
        return resp.status(401).json({ message: "ha ocurrido un error!" })
      })

  }

  public getData(id: string): any {
    getCacheDataById(this.cacheKey, id)
  }

  public signUp(
    data: {
      username: string
      password: string
      email: string
      first_name: string
      last_name: string
    },
    resp: Response
  ): any {
    this.DB.call('createuser', `'${data.username}'::varchar , '${bcrypt.hashSync(data.password, 10)}'::varchar, '${data.email}'::varchar, '${data.first_name}'::varchar, '${data.last_name}'::varchar`).exec().then((_res: any) => {
      return resp.status(200).json({ message: "Usuario creado" });
    }).catch((error: any) => {
      console.log(error)
      return resp.status(401).json({ message: "ha ocurrido un error!" })
    })
  }
}
