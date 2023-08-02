import { getCacheDataById, singCacheData } from '@Cache/index'
import { Model } from '@Model/index'
import bcrypt from 'bcrypt'
import { Response } from 'express'

export class AuthModel extends Model {
  protected tableName = 'User'
  private cacheKey: string = 'Auth'
  constructor() {
    super()
  }

  public signIn(
    data: { username: string; password: string },
    res: Response
  ): Response {
    let { username, password } = data
    let fields = ['username', 'first_name', 'last_name', 'password']
    let userData = this.DB.view(fields, 'user_view')
      .where([`"username" = '${username}'`])
      .exec()
    if (!bcrypt.compareSync(password, userData.password as string))
      return res.status(401).json({
        status: 1,
        message: 'invalid Password!',
      })

    return res.status(200).json(singCacheData(this.cacheKey, userData))
  }

  public getData(id: string) {
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
    res: Response
  ) {
    console.log(data)
    res.status(200).send('successfull singUp')
  }
}
