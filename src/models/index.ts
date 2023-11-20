import { DB as DBA } from '@DB/index'
export abstract class Model {
  protected schemaName: string = 'public'
  protected tableName: string = 'test'
  DB: any
  initBD(): void {
    this.DB = new DBA(this.schemaName, this.tableName)
  }
}
