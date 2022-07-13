import "dotenv/config";
import express from "express";

import { routes } from "#Routes/api";
import DB from "#Class/database";

const app = express();

routes(app);
// let db = new DB();
// db.Connect();

app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(`listening on port ${process.env.SERVER_PORT || 3000}`);
});
