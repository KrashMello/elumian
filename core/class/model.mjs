import express from "express";
export default class Model {
  constructor() {
    this.app = express.Router();
  }

  router() {
    return this.app;
  }

  get(middelware = [], _callback) {
    middelware =
      typeof middelware === Array
        ? (middelware = middelware)
        : (_callback = middelware);
    if (middelware.length > 0) this.app.get("/", middelware, _callback);
    else this.app.get("/", _callback);
  }

  created(middelware = [], _callback) {
    middelware =
      typeof middelware === Array
        ? (middelware = middelware)
        : (_callback = middelware);
    if (middelware.length > 0) this.app.post("/", middelware, _callback);
    else this.app.post("/", _callback);
  }

  updated(middelware = [], _callback) {
    middelware =
      typeof middelware === Array
        ? (middelware = middelware)
        : (_callback = middelware);
    if (middelware.length > 0) this.app.put("/:code", middelware, _callback);
    else this.app.put("/:code", _callback);
  }

  delete(middelware = [], _callback) {
    middelware =
      typeof middelware === Array
        ? (middelware = middelware)
        : (_callback = middelware);
    if (middelware.length > 0) this.app.delete("/:code", middelware, _callback);
    else this.app.get("/", _callback);
  }
}
