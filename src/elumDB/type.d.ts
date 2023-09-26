type Diff<T, U> = T extends U ? never : T

type NotNullable<T> = Diff<T, null | undefined>

export type retrunVarchar = `varchar(${number})`

export type tablesRef = `${string}.${string}.${string}`
export type typeRef = '>' | '<' | '-'
export type returnRef =
  `ALTER TABLE "<schemaRef>"."<tableRef>" ADD FOREIGN KEY ("<columnRef>") REFERENCES "${string}"."${string}" ("${string}");` |
  `ALTER TABLE "${string}"."${string}"  ADD FOREIGN KEY ("${string}") REFERENCES "<schemaRef>"."<tableRef>" ("<columnRef>");` |
  ''

export interface options {
  varchar: (v: number) => retrunVarchar
  smallInt: 'SMALLINT'
  bigInt: 'BIGINT'
  text: 'TEXT'
  pk: 'PRIMARY KEY'
  increment: 'GENERATED BY DEFAULT AS IDENTITY'
  unique: 'UNIQUE'
  notNull: 'NOT NULL'
  boolean: 'BOOLEAN'
  bool: 'BOOL'
  timeStamp: 'TIMESTAMP'
  ref: (k: typeRef, i: tablesRef) => returnRef
}

interface functionsFields {
  parameters: Record<string, string>
  return: string
  declare?: Record<string, string>
  comantBlock: string
}

interface procedureFields {
  parameters: {
    in: Record<string, string>,
    out?: Record<string, string>
  }
  declare?: Record<string, string>
  comantBlock: string
}
export type schemaFunctions = Record<string, functionsFields> | null

export type schemaProcedure =
  Record<string, procedureFields> | null


export type columnsPropiety =
  | 'TIMESTAMP'
  | 'BOOL'
  | 'BOOLEAN'
  | 'NOT NULL'
  | 'UNIQUE'
  | 'GENERATED BY DEFAULT AS IDENTITY'
  | 'PRIMARY KEY'
  | 'BIGINT'
  | 'TEXT'
  | 'SMALLINT'
  | retrunVarchar
  | returnRef

export type schemaTables = Record<string, Record<string, columnsPropiety[]>>

export interface schemaUp {
  schema: string
  tables: string
  ref: string
  procedures: string
  functions: string
}

export interface schemaDown {
  schema: string
  tables: string
}
export interface schemas {
  up: schemaUp
  down: schemaDown
}
