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
    fields: {
      type: varchar(30)
    },
    comantBlock: `
      return false;
    `
  }
}

const procedure: schemaProcedure = {
  createTask: {
    fields: {
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
  }
}

const tablesDrop: string[] = Object.keys(tables)

export default {
  up: schema.create(schemaName, tables, procedure, functions),
  down: schema.drop(schemaName, tablesDrop)
}
