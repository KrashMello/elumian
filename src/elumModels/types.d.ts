export interface queryBuilder {
  t: string
  select: function
  where: function
}

export interface ModelInterfaceClass {
  tableName: string
  DB: any
}
