import { DB as db } from '@DB/index'
export abstract class Model {
  protected tableName: string = 'test'
  public DB: any
  constructor() {
    this.DB = new db(this.tableName)
  }

  public async findAll() {}
  public async findOne(_id: string) {}
}
