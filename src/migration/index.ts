import { Migration } from '@DB/migration'
import publicSchema from './public.schema'
import taskSchema from './task.schema'

let schemas = [publicSchema, taskSchema]
console.log(process.env.npm_config_typem)

let type = process.env.npm_config_typem || 'up'

new Migration(type, schemas)
