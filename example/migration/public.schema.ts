import { Schema } from '@DB/schema'
import { type schemaTables } from '@DB/type'

// let { smallInt, pk, unique, varchar, bigInt, text, increment } = options
const schema = new Schema()
const schemaName = 'public'

const tables: schemaTables = {}

const tablesDrop: string[] = Object.keys(tables)

export default {
  up: schema.create(schemaName, tables),
  down: schema.drop(schemaName, tablesDrop)
}
