import { DB as db } from '@DB/index'
import { schemaCreate } from './types'
export class Migration {
  private DB: any
  private migrations = {
    schemas: '',
    tables: '',
    ref: '',
  }
  constructor(schemas: Array<schemaCreate>) {
    this.DB = new db()
    schemas.map((schema) => {
      this.migrations.schemas += schema.schema
      this.migrations.tables += schema.tables
      this.migrations.ref += schema.ref
    })
  }
  start() {
    this.DB.queryExec(this.migrations.schemas)
    this.DB.queryExec(this.migrations.tables)
  }
}
