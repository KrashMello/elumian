import { Schema, options } from '@DB/schema'
import { type schemaTables } from '@DB/type'

const { pk, unique, varchar, notNull, bigInt, text, increment } =
  options
const schema = new Schema()
const schemaName = 'task'

const tables: schemaTables = {
  tasks: {
    id: [bigInt, pk, increment, notNull],
    code: [varchar(15), unique],
    name: [varchar(255), notNull],
    description: [text, notNull]
  },
}
const tablesDrop: string[] = Object.keys(tables)

export default {
  up: schema.create(schemaName, tables),
  down: schema.drop(schemaName, tablesDrop)
}
