import pg from "pg";

const config = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || "postges",
    user: process.env.DB_USERNAME || "postgre",
    password: process.env.DB_PASSWORD || "",
};

class Postgres {
    constructor() {
        this.Pool = pg.Pool;
        this.pool = new this.Pool(config);
    }

    Connect() {
        this.pool
            .connect()
            .then(() => console.log("connected"))
            .catch((err) => console.error("connection error", err.stack));
    }

    async view() {
        let result = await this.pool.query("SELECT * FROM view_usuarios");
        return result;
    }
}

class Mysql {
    constructor() {}
}

const db = process.env.DB_CONNECTION === "pgsql" ? new Postgres() : new Mysql();
export default db;
