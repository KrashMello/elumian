import { DB } from '@DB/index'
import { Model } from '@Model/index'
export class TaskModel extends Model {
  tableName = 'task'
  constructor() {
    super()
    this.DB = new DB(this.tableName)
  }
  async findOne(id: string) {
    let result: any = await this.DB.select()
      .where(`"id" = '${id}'::bigint`)
      .exec()

    return result.rows[0]
  }

  async findAll() {
    let result = await this.DB.select().exec()
    return result.rows
  }

  create(data: string[]) {
    return this.DB.call('createTask', data.toString()).exec()
  }
}
