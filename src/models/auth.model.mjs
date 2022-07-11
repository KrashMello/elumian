import Model from "#Class/model";

import dbpg from "#Class/database";

export default class Auth extends Model {
  //the constructor
  constructor() {
    super();
  }
  //extra method
  singIn(_callback) {
    this.app.post("/singIn", _callback);
  }
}
