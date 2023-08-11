import { Schema } from '@DB/schema'
import { schemaTables } from '@DB/type'

// let { smallInt, pk, unique, varchar, bigInt, text, increment } = options
const schema = new Schema()
const schema_name = 'public'

const tables: schemaTables = {}

const tablesDrop: string[] = Object.keys(tables)

export default {
  up: schema.create(schema_name, tables),
  down: schema.drop(schema_name, tablesDrop)
}
