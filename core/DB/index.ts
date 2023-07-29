import { MongoClient } from 'mongodb'
import pg from 'pg'
import 'dotenv/config'
class PGSQL {
  private tableName: string = 'user'
  private query: string = ''
  private config: object =
    process.env.DB_URL === ''
      ? {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          database: process.env.DB_DATABASE || 'postges',
          user: process.env.DB_USERNAME || 'postgre',
          password: process.env.DB_PASSWORD || '',
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
  private pool = new pg.Pool(this.config)

  private DATE_OID = 1082
  private parseDate = (value: any) => value

  constructor(tableName: string = 'user') {
    this.tableName = tableName
    pg.types.setTypeParser(this.DATE_OID, this.parseDate)
  }

  table(name: string) {
    if (!(typeof name === 'string'))
      throw new Error('el tipo del parametro de la tabla no es valido')
    this.tableName = name
    return this
  }

  select(fields: string | string[] = '*') {
    if (!(typeof fields === 'string') && !Array.isArray(fields))
      throw new Error('parametros del select no son validos')
    const _fields = typeof fields === 'string' ? [fields] : fields
    this.query = `SELECT ${_fields.join(', ')} from ${this.tableName}`
    return this
  }

  where(fields: string | string[] = `id = 1`) {
    if (!(typeof fields === 'string') && !Array.isArray(fields))
      throw new Error('parametros del where no son validos')
    const _fields = typeof fields === 'string' ? [fields] : fields

    this.query += ` where ${_fields.join(' AND ')}`
    return this
  }

  limit(field: number) {
    if (!(typeof field === 'number'))
      throw new Error('parametros del limit no son validos')

    this.query += ` limit ${field.toString()}`
    return this
  }

  offset(field: number) {
    if (!(typeof field === 'number'))
      throw new Error('parametros del offset no son validos')

    this.query += ` offset ${field.toString()}`
    return this
  }
  call(procedure: string, fields: string | string[] = '1') {
    if (
      !(typeof procedure === 'string') &&
      procedure === null &&
      procedure === undefined &&
      procedure === '' &&
      !(typeof fields === 'string') &&
      !Array.isArray(fields)
    )
      throw new Error('parametros del call no son validos')
    if (this.query !== '') throw new Error('formula no valida para ejecutar')
    const _fields = typeof fields === 'string' ? [fields] : fields
    this.query = `CALL "${procedure}"(${_fields.join(', ')})`
    return this
  }

  view(fields: string | string[], view: string) {
    if (
      !(typeof fields === 'string') &&
      !Array.isArray(fields) &&
      !(typeof view === 'string') &&
      view === undefined &&
      view === null &&
      view === ''
    )
      throw new Error(
        'los tipos de parametros ingrezados en view no son validos'
      )
    const _fields = typeof fields === 'string' ? [fields] : fields
    this.query = `SELECT ${_fields.join(', ')} FROM ${view} `
    return this
  }

  queryExec(query: string) {
    if (!(typeof query === 'string') && query === null)
      throw new Error(
        'no se puede ejecutar este comando por que no existe una consulta'
      )

    let result = this.pool.query(query)
    return result
  }

  exec() {
    if (!(typeof this.query === 'string') && this.query === null)
      throw new Error(
        'no se puede ejecutar este comando por que no existe una consulta'
      )

    let result = this.pool.query(this.query)
    this.query = ''
    return result
  }
}

class MONGODB {
  private client = new MongoClient(process.env.DB_URL ?? 'localhost')
  private DB_DATABASE = process.env.DB_DATABASE ?? 'test'
  private tableName: string = 'task'
  constructor(tableName: string = 'test') {
    this.tableName = tableName
  }
  public async findOne(query: object, options: object = {}) {
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
  public async find(query: object, options: object = {}) {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)

      const collection = await collections.find(query, options)
      if ((await collections.countDocuments(query)) === 0) {
        return 'No documents found!'
      }
      return collection
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }

  public async insertOne(doc: object) {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)
      // create a document to insert
      const collection = await collections.insertOne(doc)

      return `A document was inserted with the _id: ${collection.insertedId}`
    } finally {
      await this.client.close()
    }
  }
  public async insertMany(docs: object[]) {
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
  public async updateOne(filter: object, doc: object[], options: object = {}) {
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
  public async updateMany(filter: object, doc: object[], options: object = {}) {
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
  public async replaceOne(filter: object, doc: object[], options: object = {}) {
    try {
      const database = this.client.db(this.DB_DATABASE)
      const collections = database.collection(this.tableName)
      // preplace a document to insert
      const collection = await collections.replaceOne(filter, doc, options)
      return `Modified ${collection.modifiedCount} document(s)`
    } finally {
      await this.client.close()
    }
  }
  public async deleteOne(doc: object) {
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
  public async deleteMany(doc: object) {
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
export let DB =
  process.env.DB_CONNECTION === 'pgsql'
    ? PGSQL
    : process.env.DB_CONNECTION === 'mongodb'
    ? MONGODB
    : PGSQL
