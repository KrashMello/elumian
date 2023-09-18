import { Schema, options } from '@DB/schema'
import type { schemaFunctions, schemaProcedure, schemaTables } from '@DB/type'

const { pk, unique, varchar, notNull, bigInt, text, increment } =
  options
const schema = new Schema()
const schemaName = 'task'

const tables: schemaTables = {
  tasks: {
    id: [bigInt, pk, increment, notNull],
    code: [varchar(15), unique],
    name: [varchar(255), notNull],
    description: [text, notNull]
  },
}
const functions: schemaFunctions = {
  codegen: {
    parameters: {
      type: varchar(30)
    },
    return: varchar(15),
    comantBlock: `
      RETURN type;
    `
  }
}

const procedure: schemaProcedure = {
  createTask: {
    parameters: {
      in: {
        _name: varchar(255),
        _description: text
      }
    },
    declare: {
      _code: varchar(15)
    },
    comantBlock: `
      _code := codegen('task');
      Insert into tasks(code,"name",description) values (code,_name,_description);
      `
  },
  updateTask: {
    parameters: {
      in: {
        _code: varchar(15),
        _name: varchar(255),
        _description: text
      }
    },
    comantBlock: `
      update "task"."tasks"
		set  "name" = _name,
		description = _description,
		updated_at = now()
	where code = _code;
      `
  }

}

const tablesDrop: string[] = Object.keys(tables)

export default {
  up: schema.create(schemaName, tables, procedure, functions),
  down: schema.drop(schemaName, tablesDrop)
}
