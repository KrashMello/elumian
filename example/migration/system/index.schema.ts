import { Schema } from '@DB/schema'
import { procedure } from './procedure'
import { functions } from './functions'
import { tables } from './tables'

const schema = new Schema()
const schemaName = 'system'

const tablesDrop: string[] = Object.keys(tables)

export default {
  up: schema.create(schemaName, tables, procedure, functions),
  down: schema.drop(schemaName, tablesDrop)
}
