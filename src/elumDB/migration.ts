import { DB as DBA } from '@DB/index'
import { type schemas } from './type'
export class Migration {
  private readonly DB: any
  private readonly migrationsUp = {
    schemas: '',
    tables: '',
    ref: '',
    procedures: '',
    functions: ''
  }

  private readonly migrationsDown = {
    schemas: '',
    tables: '',
    ref: '',
  }

  constructor(schemas: schemas[]) {
    this.DB = new DBA()
    schemas.forEach((schema) => {
      this.migrationsUp.schemas += schema.up.schema
      this.migrationsUp.tables += schema.up.tables
      this.migrationsUp.ref += schema.up.ref
      this.migrationsUp.functions += schema.up.functions
      this.migrationsUp.procedures += schema.up.procedures
      this.migrationsDown.schemas += schema.down.schema
      this.migrationsDown.tables += schema.down.tables
    })
  }

  public up(): void {
    try {
      console.log('Migration Start')
      // console.log({ schema: this.migrationsUp.schemas, tables: this.migrationsUp.tables, ref: this.migrationsUp.ref, functions: this.migrationsUp.functions, procedures: this.migrationsUp.procedures })
      this.DB.queryExec(this.migrationsUp.schemas).then((_res: any) => {
        this.DB.queryExec(this.migrationsUp.tables).then((_res: any) => {
          this.DB.queryExec(this.migrationsUp.functions).catch((err: any) => { throw new Error(err); })
          this.DB.queryExec(this.migrationsUp.procedures).catch((err: any) => { throw new Error(err); })
          this.DB.queryExec(this.migrationsUp.ref).catch((err: any) => { throw new Error(err); })
        }).catch((err: any) => { throw new Error(err); })
      }).catch((err: any) => { throw new Error(err); })
      console.log('Migration Done')
    } catch (err) {
      console.log(err)
      console.log('Migration Failed')
    }
  }

  public down(): void {
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

  start(type: 'up' | 'down'): void {
    if (type === 'up') this.up()
    else if (type === 'down') this.down()
    else console.log('invalid type')
  }
}
