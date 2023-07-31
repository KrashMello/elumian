import { Model } from '@Model/index'
export class AuthModel extends Model {
  tableName = 'User'
  constructor() {
    super()
  }

  signIn(username: string, password: string) {
    let findData = ['username', 'first_name', 'last_name']
    return this.DB.view(findData, 'user_view')
      .where([`"username" = '${username}'`, `"password" = '${password}'`])
      .exec()
  }
}
