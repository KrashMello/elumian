import {
  schemaTables,
  options as optionsType,
  retrunVarchar,
  schemaUp,
  schemaDown,
  returnRef,
  typeRef,
  tablesRef,
} from './type'

const options: optionsType = {
  varchar: (length: number = 255): retrunVarchar => {
    return `varchar(${length})`
  },
  smallInt: 'SMALLINT',
  bigInt: 'BIGINT',
  text: 'TEXT',
  pk: 'PRIMARY KEY',
  increment: 'GENERATED BY DEFAULT AS IDENTITY',
  unique: 'UNIQUE',
  notNull: 'NOT NULL',
  boolean: 'BOOLEAN',
  bool: 'BOOL',
  timeStamp: 'TIMESTAMP',
  ref: (type: typeRef, tables: tablesRef): returnRef => {
    let [schema, table, column] = tables.split('.')

    switch (type) {
      case '>':
        return `ALTER TABLE "<schemaRef>"."<tableRef>" ADD FOREIGN KEY ("<columnRef>") REFERENCES "${schema}"."${table}" ("${column}");`
      case '<':
        return `ALTER TABLE "${schema}"."${table}"  ADD FOREIGN KEY ("${column}") REFERENCES "<schemaRef>"."<tableRef>" ("<columnRef>");`
      case '-':
        return `ALTER TABLE "<schemaRef>"."<tableRef>" ADD FOREIGN KEY ("<columnRef>") REFERENCES "${schema}"."${table}" ("${column}");`
      default:
        return ''
    }
  },
}

class Schema {
  constructor() {}
  public create(schema_name: string, tables: schemaTables): schemaUp {
    let tablesName: Array<string> = Object.keys(tables) as string[]
    let ref: Array<string> = []
    let valuesColumns: Array<string> = tablesName.map((key) => {
      return `CREATE TABLE IF NOT EXISTS "${schema_name}"."${key}" (
      ${Object.keys(tables[key] as { [key: string]: Array<string> })
        .map((columns) => {
          let column: Array<string> = tables[key]![columns] as string[]

          if (column.filter((v) => v.includes('ALTER TABLE ')).toString())
            ref.push(
              column
                .filter((v) => v.includes('ALTER TABLE '))
                .map((v) => {
                  return v
                    .replace(/<schemaRef>/g, schema_name)
                    .replace(/<tableRef>/g, key)
                    .replace(/<columnRef>/g, columns)
                })
                .toString()
            )
          column = column.filter((v) => !v.includes('ALTER TABLE'))
          return `"${columns}" ${column.toString().replace(/,/g, ' ')}\\`
        })
        .toString()
        .replace(/,/g, '\n')}
      "created_at" timestamp default 'now()'\\
      "updated_at" timestamp default 'now()'
      );`
    })
    let query = {
      schema: `CREATE SCHEMA IF NOT EXISTS "${schema_name}";`,
      tables: `${valuesColumns
        .toString()
        .replace(/,/g, '')
        .replace(/(\\)|(,\s)/g, ',')}`.replace(/(\s{2,})/g, ''),
      ref: ref.toString().replace(/,/g, ''),
    }
    return query
  }
  public drop(schema_name: string, tables: Array<string>): schemaDown {
    return {
      schema: `${
        schema_name !== 'public' ? 'DROP SCHEMA "' + schema_name + '"' : ''
      }`,
      tables: tables
        .map((tableName) => {
          return `DROP TABLE IF EXISTS "${schema_name}"."${tableName}" CASCADE;`
        })
        .toString()
        .replace(/,/g, '')
        .replace(/(\\)|(,\s)/g, ','),
    }
  }
}

export { Schema, options }
