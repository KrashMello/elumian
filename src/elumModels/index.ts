import { DB as DBA } from '@DB/index'
import { type ModelInterfaceClass } from './types'
export abstract class Model implements ModelInterfaceClass {
  tableName: string = 'test'
  DB: any
  constructor () {
    this.DB = new DBA(this.tableName)
  }
}
