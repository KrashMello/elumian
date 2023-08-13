import { getCacheDataById, singCacheData } from '@Cache/index'
import { Model } from '@Model/index'
import bcrypt from 'bcrypt'
import { type Response } from 'express'

export class AuthModel extends Model {
  tableName = 'User'
  private readonly cacheKey: string = 'Auth'

  public signIn(
    data: { username: string, password: string },
    resp: Response
  ): any {
    const { username, password } = data
    const fields = ['username', 'first_name', 'last_name', 'password']
    const userData = this.DB.view(fields, 'user_view')
      .where([`"username" = '${username}'`])
      .exec().then((res: any) => {
        if (res.row.lenght === 0)
          return resp.status(401).json({ message: "usuario invalido" })
        if (!bcrypt.compareSync(password, userData.password as string)) {
          return resp.status(401).json({
            message: 'contraseña invalida'
          })
        }
        return res.status(200).json(singCacheData(this.cacheKey, userData))
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
    this.DB.call('createuser', `'${data.username}'::varchar , '${bcrypt.hashSync(data.password, 10)}'::varchar, '${data.email}'::varchar, '${data.first_name}'::varchar, '${data.last_name}'::varchar`).exec().then((res: any) => {
      return resp.status(200).json({ message: "Usuario creado" });
    }).catch((error: any) => {
      console.log(error)
      return resp.status(401).json({ message: "ha ocurrido un error!" })
    })
  }
}
