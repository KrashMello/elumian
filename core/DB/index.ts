import pg from "pg";
export class DB {
  private tableName: string = "user";
  private query: string = "";
  private config: object =
    process.env.DB_EXTERNAL_CONNECTION === ""
      ? {
          host: process.env.DB_HOST || "localhost",
          port: process.env.DB_PORT || 5432,
          database: process.env.DB_DATABASE || "postges",
          user: process.env.DB_USERNAME || "postgre",
          password: process.env.DB_PASSWORD || "",
        }
      : {
          connectionString: process.env.DB_EXTERNAL_CONNECTION,
          ssl: {
            rejectUnauthorized: process.env.DB_SSL,
          },
        };
  private pool = new pg.Pool(this.config);

  private DATE_OID = 1082;
  private parseDate = (value: any) => value;

  constructor(tableName: string = "user") {
    this.tableName = tableName;
    pg.types.setTypeParser(this.DATE_OID, this.parseDate);
  }

  table(name: string) {
    if (!(typeof name === "string"))
      throw new Error("el tipo del parametro de la tabla no es valido");
    this.tableName = name;
    return this;
  }

  select(fields: string | string[] = "*") {
    if (!(typeof fields === "string") && !Array.isArray(fields))
      throw new Error("parametros del select no son validos");
    const _fields = typeof fields === "string" ? [fields] : fields;
    this.query = `SELECT ${_fields.join(", ")} from ${this.tableName}`;
    return this;
  }

  where(fields: string | string[] = `id = 1`) {
    if (!(typeof fields === "string") && !Array.isArray(fields))
      throw new Error("parametros del where no son validos");
    const _fields = typeof fields === "string" ? [fields] : fields;

    this.query += ` where ${_fields.join(" AND ")}`;
    return this;
  }

  limit(field: number) {
    if (!(typeof field === "number"))
      throw new Error("parametros del limit no son validos");

    this.query += ` limit ${field.toString()}`;
    return this;
  }

  offset(field: number) {
    if (!(typeof field === "number"))
      throw new Error("parametros del offset no son validos");

    this.query += ` offset ${field.toString()}`;
    return this;
  }
  call(procedure: string, fields: string | string[] = "1") {
    if (
      !(typeof procedure === "string") &&
      procedure === null &&
      procedure === undefined &&
      procedure === "" &&
      !(typeof fields === "string") &&
      !Array.isArray(fields)
    )
      throw new Error("parametros del call no son validos");
    if (this.query !== "") throw new Error("formula no valida para ejecutar");
    const _fields = typeof fields === "string" ? [fields] : fields;
    this.query = `CALL ${procedure}(${_fields.join(", ")})`;
    return this;
  }

  view(fields: string | string[], view: string) {
    if (
      !(typeof fields === "string") &&
      !Array.isArray(fields) &&
      !(typeof view === "string") &&
      view === undefined &&
      view === null &&
      view === ""
    )
      throw new Error(
        "los tipos de parametros ingrezados en view no son validos"
      );
    const _fields = typeof fields === "string" ? [fields] : fields;
    this.query = `SELECT ${_fields.join(", ")} FROM ${view} `;
    return this;
  }

  exec() {
    if (!(typeof this.query === "string") && this.query === null)
      throw new Error(
        "no se puede ejecutar este comando por que no existe una consulta"
      );
    let query = this.query;
    this.query = "";
    return this.pool.query(query);
  }
}
