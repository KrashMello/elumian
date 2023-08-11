import { Model } from '@Model/index'
import { Cache } from '@Cache/index'
export class UserModel extends Model {
  tableName = 'users'
  userCache = new Cache(1)

  constructor () {
    super()
  }

  create (data: string[]) {
    return this.DB.call('createUser', data.toString()).exec()
  }
}
