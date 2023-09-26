import { Migration } from '@DB/migration'
// import publicSchema from './public.schema'
import taskSchema from './task/index.schema'
import systemSchema from './system/index.schema'

const schemas = [systemSchema, taskSchema]

const type: 'up' | 'down' =
  (process.env.npm_config_type as 'up' | 'down') ?? 'up'

const migration = new Migration(schemas)

migration.start(type)
