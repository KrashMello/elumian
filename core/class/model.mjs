import express from "express";
import verifyToken from "#Middelware/auth";
export default class Model {
  constructor() {
    this.app = express.Router();
    this.verifyToken = verifyToken;
    this.middelwareExepction = [];
  }

  router() {
    return this.app;
  }
  routes(url, routeName, method, _callback) {
    if (
      typeof url === "string" &&
      typeof routeName === "string" &&
      typeof method === "string" &&
      typeof _callback === "function"
    ) {
      const HASMIDDELWARE = this.hasMiddelware(routeName);
      let route = this.app.get("/", _callback);
      switch (method) {
        case "GET":
          route = HASMIDDELWARE
            ? this.app.get(url, this.verifyToken, _callback)
            : this.app.get(url, _callback);
          break;
        case "POST":
          route = HASMIDDELWARE
            ? this.app.post(url, this.verifyToken, _callback)
            : this.app.post(url, _callback);
          break;
        case "PUT":
          route = HASMIDDELWARE
            ? this.app.put(url, this.verifyToken, _callback)
            : this.app.put(url, _callback);
          break;
        case "DELETE":
          route = HASMIDDELWARE
            ? this.app.delete(url, this.verifyToken, _callback)
            : this.app.delete(url, _callback);
          break;
      }
      return route;
    } else return null;
  }

  hasMiddelware(type) {
    let result = true;
    this.middelwareExepction.map((value) => {
      result = value === type ? false : true;
    });
    return result;
  }

  get(_callback) {
    this.routes("/", "get", "GET", _callback);
  }

  created(_callback) {
    this.routes("/", "create", "POST", _callback);
  }

  updated(_callback) {
    this.routes("/:code", "update", "PUT", _callback);
  }

  delete(_callback) {
    this.routes("/:code", "delete", "DELETE", _callback);
  }
}
