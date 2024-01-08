import { Schema } from '@elumian/db/schema'
import { tables } from './tables'
import { procedure } from './procedure'
import { functions } from './functions'

const schema = new Schema()
const schemaName = 'task'

const tablesDrop: string[] = Object.keys(tables)

export default {
  up: schema.create(schemaName, tables, procedure, functions),
  down: schema.drop(schemaName, tablesDrop),
}
