import pg from "pg";

class Postgres {
  #config = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || "postges",
    user: process.env.DB_USERNAME || "postgre",
    password: process.env.DB_PASSWORD || "",
  };

  constructor() {
    this.Pool = pg.Pool;
    this.pool = new this.Pool(this.#config);
  }

  Connect() {
    this.pool
      .connect()
      .then(() => console.log("connected"))
      .catch((err) => console.error("connection error", err.stack));
  }

  select(columns = "*", table_name = "", conditions = "", limit = -1) {
    if (columns !== "*" && columns === Array) {
      let columns = columns
        .map((value) => {
          return '"' + value + '"';
        })
        .toString();
    }
    if (table_name !== "") {
      let query = "SELECT " + columns + " FROM " + table_name;
      if (conditions !== "") query += " WHERE " + conditions;
      if (limit > -1) query += " LIMIT " + limit;
      let result = this.pool.query("select * from (" + query + ") as sc");
      return result;
    } else {
      let query = "SELECT " + columns;
      let result = this.pool.query("select * from (" + query + ") as sc");
      return result;
    }
  }
}

class Mysql {
  constructor() {}
}

const db = process.env.DB_CONNECTION === "pgsql" ? Postgres : Mysql;
export default db;
