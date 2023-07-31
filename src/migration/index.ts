import { Migration } from '@DB/migration'
import publicSchema from './public.schema'
import taskSchema from './task.schema'

let schemas = [publicSchema, taskSchema]

console.log(process.env.npm_config_type)
let type: 'up' | 'down' = (process.env.npm_config_type as 'up' | 'down') || 'up'

new Migration(type, schemas)
