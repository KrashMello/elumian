import { Migration } from '@DB/migration'
import publicSchema from './public.schema'
import taskSchema from './task.schema'

let schemas = [publicSchema, taskSchema]

let migration = new Migration(schemas)

migration.start()
