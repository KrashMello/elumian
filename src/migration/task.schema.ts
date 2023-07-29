import { Schema, options } from '@DB/schema'
import { schemaTables } from '@DB/types'

let { smallInt, pk, unique, varchar, bigInt, text, increment } = options
let schema = new Schema()
let schema_name = 'task'

let tables: schemaTables = {
  task: {
    id: [smallInt, pk, increment],
    name: [varchar(15), unique],
  },
  blog: {
    id: [bigInt, pk, increment],
    name: [varchar(60)],
    description: [text],
  },
  status: {
    id: [bigInt, pk, increment],
    name: [varchar(60)],
  },
}
let tablesDrop: Array<string> = Object.keys(tables)

export default {
  up: schema.create(schema_name, tables),
  down: schema.drop(schema_name, tablesDrop),
}
