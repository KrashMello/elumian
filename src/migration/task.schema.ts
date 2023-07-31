import { Schema, options } from '@DB/schema'
import { schemaTables } from '@DB/type'

let { smallInt, pk, unique, varchar, notNull, bigInt, text, increment, ref } =
  options
let schema = new Schema()
let schema_name = 'task'

let tables: schemaTables = {
  tasks: {
    id: [bigInt, pk, increment, notNull],
    code: [varchar(15), unique],
    name: [varchar(255), notNull],
    description: [text, notNull],
  },
  tags: {
    id: [smallInt, pk, increment, notNull],
    code: [varchar(15), unique, notNull],
    name: [varchar(255), notNull],
  },
  tagsPerTask: {
    id: [bigInt, pk, increment, notNull],
    tag_code: [varchar(15), ref('>', `${schema_name}.tags.code`)],
    task_code: [varchar(15), ref('>', `${schema_name}.tasks.code`)],
  },
}
let tablesDrop: Array<string> = Object.keys(tables)

export default {
  up: schema.create(schema_name, tables),
  down: schema.drop(schema_name, tablesDrop),
}
