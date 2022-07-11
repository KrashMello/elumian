import Model from "#Class/model";

import dbpg from "#Class/database";

export default class Auth extends Model {
  //the constructor
  constructor() {
    super();
    this.middelwareExepction = ["singIn"];
  }
  //extra method
  singIn(_callback) {
    this.routes("/", "singIn", "POST", _callback);
  }
}
