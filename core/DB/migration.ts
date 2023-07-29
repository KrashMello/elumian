import { DB as db } from '@DB/index'
import { schemas } from './types'
export class Migration {
  private DB: any
  private migrationsUp = {
    schemas: '',
    tables: '',
    ref: '',
  }
  private migrationsDown = {
    schemas: '',
    tables: '',
    ref: '',
  }
  constructor(type: string, schemas: Array<schemas>) {
    this.DB = new db()
    schemas.map((schema) => {
      this.migrationsUp.schemas += schema.up.schema
      this.migrationsUp.tables += schema.up.tables
      this.migrationsUp.ref += schema.up.ref
      this.migrationsDown.schemas += schema.down.schema
      this.migrationsDown.tables += schema.down.tables
    })

    this.start(type)
  }
  public up() {
    try {
      console.log('Migration Start')
      this.DB.queryExec(this.migrationsUp.schemas)
      this.DB.queryExec(this.migrationsUp.tables)
      console.log('Migration Done')
    } catch (err) {
      console.log(err)
    }
  }

  public down() {
    try {
      console.log('Migration Start')
      this.DB.queryExec(this.migrationsDown.tables).then((_res: any) => {
        this.DB.queryExec(this.migrationsDown.schemas)
      })
      console.log('Migration Done')
    } catch (err) {
      console.log(err)
    }
  }
  start(type: string) {
    if (type === 'up') this.up()
    else if (type === 'down') this.down()
    else console.log('invalid type')
  }
}
