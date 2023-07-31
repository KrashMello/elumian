import { Schema } from '@DB/schema'
import { schemaTables } from '@DB/type'

// let { smallInt, pk, unique, varchar, bigInt, text, increment } = options
let schema = new Schema()
let schema_name = 'public'

let tables: schemaTables = {}

let tablesDrop: Array<string> = Object.keys(tables)

export default {
  up: schema.create(schema_name, tables),
  down: schema.drop(schema_name, tablesDrop),
}
