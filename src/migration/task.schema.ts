import { Schema, options } from '@DB/schema'
import { schemaTables } from '@DB/types'

let { smallInt, pk, unique, varchar, bigInt, text, increment } = options
let schema = new Schema()

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

export default schema.create('task', tables)
