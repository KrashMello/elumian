import { Migration } from '@elumian/db/migration'
// import publicSchema from './public.schema'
import taskSchema from './task/index.schema'
import TaskModel from '../models/task.model'
// import systemSchema from './system/index.schema'
// TODO: make this and create class type

const schemas = [taskSchema]
const type: 'up' | 'down' =
  (process.env.npm_config_type as 'up' | 'down') ?? 'up'

const migration = new Migration(schemas)

migration.start(type)

const tc = async () => {
  console.log(await new TaskModel().findAll())
}
tc()
