import { MongoClient } from 'mongodb'
import pg from 'pg'
import 'dotenv/config'
class PGSQL {
  private readonly schemaName: string
  private tableName: string
  private query: string = ''
  private readonly config: object =
    process.env.DB_URL === ''
      ? {
          host: process.env.DB_HOST ?? 'localhost',
          port: process.env.DB_PORT ?? 5432,
          database: process.env.DB_DATABASE ?? 'postges',
          user: process.env.DB_USERNAME ?? 'postgre',
          password: process.env.DB_PASSWORD ?? '',
          max: 20,
          idleTimeoutMillis: 1000,
          connectionTimeoutMillis: 2000,
          ssl: false,
        }
      : {
          connectionString: process.env.DB_URL,
          max: 20,
          idleTimeoutMillis: 1000,
          connectionTimeoutMillis: 2000,
          ssl: false,
        }

  private readonly pool = new pg.Pool(this.config)

  private readonly DATE_OID = 1082
  private readonly parseDate = (value: any): any => value

  constructor(schemaName: string = 'public', tableName: string = 'user') {
    this.schemaName = schemaName
    this.tableName = tableName
    pg.types.setTypeParser(this.DATE_OID, this.parseDate)
  }

  table(name: string): this {
    if (!(typeof name === 'string')) throw new Error('Invalid argument type')
    this.tableName = name
    return this
  }

  select(fields: string | string[] = '*'): this {
    if (!(typeof fields === 'string') && !Array.isArray(fields)) {
      throw new Error('invalid argument type to select query')
    }
    const _fields = typeof fields === 'string' ? [fields] : fields
    this.query = `SELECT ${_fields.join(', ')} from "${this.schemaName}"."${
      this.tableName
    }"`
    return this
  }

  where(
    fields: string | string[] = 'id = 1',
    option: 'AND' | 'OR' = 'AND'
  ): this {
    if (!(typeof fields === 'string') && !Array.isArray(fields)) {
      throw new Error('Invalid argument type to where query')
    }
    const _fields = typeof fields === 'string' ? [fields] : fields

    this.query += ` where ${_fields.join(' ' + option + ' ')}`
    return this
  }

  limit(field: number): this {
    if (!(typeof field === 'number')) {
      throw new Error('Invalid argument to limit query')
    }

    this.query += ` limit ${field.toString()}`
    return this
  }

  offset(field: number): this {
    if (!(typeof field === 'number')) {
      throw new Error('Invalid argument to offset query')
    }

    this.query += ` offset ${field.toString()}`
    return this
  }

  join(tableName: string, codeA: string, codeB: string): this {
    if (
      !(typeof tableName === 'string') &&
      !(typeof codeA === 'string') &&
      !(typeof codeB === 'string')
    ) {
      throw new Error('Invalid argument to join query')
    }

    this.query += ` join ${tableName} on ${codeA} = ${codeB}`
    return this
  }

  leftJoin(tableName: string, codeA: string, codeB: string): this {
    if (
      !(typeof tableName === 'string') &&
      !(typeof codeA === 'string') &&
      !(typeof codeB === 'string')
    ) {
      throw new Error('Invalid argument to left join query')
    }

    this.query += `left join ${tableName} on ${codeA} = ${codeB}`
    return this
  }

  rightJoin(tableName: string, codeA: string, codeB: string): this {
    if (
      !(typeof tableName === 'string') &&
      !(typeof codeA === 'string') &&
      !(typeof codeB === 'string')
    ) {
      throw new Error('Invalid argument to right join query')
    }

    this.query += `right join ${tableName} on ${codeA} = ${codeB}`
    return this
  }

  innerJoin(tableName: string, codeA: string, codeB: string): this {
    if (
      !(typeof tableName === 'string') &&
      !(typeof codeA === 'string') &&
      !(typeof codeB === 'string')
    ) {
      throw new Error('Invalid argument to inner join query')
    }

    this.query += `inner join ${tableName} on ${codeA} = ${codeB}`
    return this
  }

  call(procedure: string, fields: string | string[] = '1'): this {
    if (
      !(typeof procedure === 'string') &&
      procedure === null &&
      procedure === undefined &&
      procedure === '' &&
      !(typeof fields === 'string') &&
      !Array.isArray(fields)
    ) {
      throw new Error('Invalid argument to Call query')
    }
    if (this.query !== '') throw new Error('Dont have a query')
    const _fields = typeof fields === 'string' ? [fields] : fields
    this.query = `CALL "${this.schemaName}"."${procedure}"(${_fields.join(
      ', '
    )})`
    return this
  }

  view(fields: string | string[] = '*', view: string): this {
    if (
      !(typeof fields === 'string') &&
      !Array.isArray(fields) &&
      !(typeof view === 'string') &&
      view === undefined &&
      view === null &&
      view === ''
    ) {
      throw new Error('Invalid argument to a view query')
    }
    const _fields = typeof fields === 'string' ? [fields] : fields
    this.query = `SELECT ${_fields.join(', ')} FROM ${this.schemaName}.${view} `
    return this
  }

  async queryExec(query: string): Promise<any> {
    if (!(typeof query === 'string') && query === null) {
      throw new Error('Dont have a query')
    }

    const result = await this.pool.query(query)
    return result
  }

  async get(): Promise<any> {
    if (!(typeof this.query === 'string') && this.query === null) {
      throw new Error('Dont have a query')
    }

    const result = this.pool.query(this.query)
    this.query = ''
    return await result
  }
}

class MONGODB {
  private readonly client = new MongoClient(process.env.DB_URL ?? 'localhost')
  private readonly DB_DATABASE = process.env.DB_DATABASE ?? 'test'
  private readonly tableName: string = 'task'
  constructor(tableName: string = 'test') {
    this.tableName = tableName
  }

  public async findOne(query: object, options: object = {}): Promise<any> {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)

      const collection = await collections.findOne(query, options)
      return collection
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }

  public async find(query: object, options: object = {}): Promise<any> {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)

      const collection = collections.find(query, options)
      if ((await collections.countDocuments(query)) === 0) {
        return 'No documents found!'
      }
      return collection
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }

  public async insertOne(doc: object): Promise<any> {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)
      // create a document to insert
      const collection = await collections.insertOne(doc)

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `A document was inserted with the _id: ${collection.insertedId}`
    } finally {
      await this.client.close()
    }
  }

  public async insertMany(docs: object[]): Promise<any> {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)
      // create many document to insert
      const collection = await collections.insertMany(docs)
      return `${collection.insertedCount} documents were inserted`
    } finally {
      await this.client.close()
    }
  }

  public async updateOne(
    filter: object,
    doc: object[],
    options: object = {}
  ): Promise<any> {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)
      // update a document to insert
      const collection = await collections.updateOne(filter, doc, options)
      return `${collection.matchedCount} document(s) matched the filter, updated ${collection.modifiedCount} document(s)`
    } finally {
      await this.client.close()
    }
  }

  public async updateMany(
    filter: object,
    doc: object[],
    options: object = {}
  ): Promise<any> {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)
      // update many document to insert
      const collection = await collections.updateMany(filter, doc, options)
      return `Successfully Updated ${collection.modifiedCount} documents`
    } finally {
      await this.client.close()
    }
  }

  public async replaceOne(
    filter: object,
    doc: object[],
    options: object = {}
  ): Promise<any> {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)
      // preplace a document to insert
      const collection = await collections.replaceOne(filter, doc, options)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `Modified ${collection.modifiedCount} document(s)`
    } finally {
      await this.client.close()
    }
  }

  public async deleteOne(doc: object): Promise<any> {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)
      // delete a document to insert
      const collection = await collections.deleteOne(doc)
      if (collection.deletedCount === 1) {
        return 'Successfully deleted one document.'
      } else {
        return 'No documents matched the query. Deleted 0 documents.'
      }
    } finally {
      await this.client.close()
    }
  }

  public async deleteMany(doc: object): Promise<any> {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)
      // delete many document to insert
      const collection = await collections.deleteMany(doc)
      return `Successfully deleted ${collection.deletedCount} document.`
    } finally {
      await this.client.close()
    }
  }
}
export const DB =
  process.env.DB_CONNECTION === 'pgsql'
    ? PGSQL
    : process.env.DB_CONNECTION === 'mongodb'
    ? MONGODB
    : PGSQL
