import { getCacheDataById, singCacheData } from '@Cache/index'
import { Model } from '@Model/index'
import bcrypt from 'bcrypt'
import { type Response } from 'express'

export class AuthModel extends Model {
  tableName = 'User'
  private readonly cacheKey: string = 'Auth'

  public signIn (
    data: { username: string, password: string },
    res: Response
  ): Response {
    const { username, password } = data
    const fields = ['username', 'first_name', 'last_name', 'password']
    const userData = this.DB.view(fields, 'user_view')
      .where([`"username" = '${username}'`])
      .exec()
    if (!bcrypt.compareSync(password, userData.password as string)) {
      return res.status(401).json({
        status: 1,
        message: 'invalid Password!'
      })
    }

    return res.status(200).json(singCacheData(this.cacheKey, userData))
  }

  public getData (id: string): any {
    getCacheDataById(this.cacheKey, id)
  }

  public signUp (
    data: {
      username: string
      password: string
      email: string
      first_name: string
      last_name: string
    },
    res: Response
  ): any {
    console.log(data)
    res.status(200).send('successfull singUp')
  }
}
