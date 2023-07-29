import { DB as db } from '@DB/index'
export abstract class Model {
  protected tableName: string = 'test'
  public DB: any
  constructor() {
    this.DB = new db(this.tableName)
  }
  public async findAll() {
    let { rows } = await this.DB.select().exec()
    return rows
  }
  public async findOne(id: string) {
    let { rows } = await this.DB.select().where(`"id" = '${id}'::bigint`).exec()

    return rows[0]
  }
}
