import Model from "#Class/model";

import dbpg from "#Class/database";

export default class Users extends Model {
  //the constructor
  constructor() {
    super();
    this.DB = new dbpg();
    this.middelwareExepction = ["get"];
  }
  //method for search a user in the data base
  async findOne(username) {
    let searchUsername = await this.DB.select(
      "*",
      "view_users",
      "username = '" + username + "'"
    )
      .then((response) => {
        return response.rows[0];
      })
      .catch((error) => {
        console.log(error);
      });
    return new Promise(
      (resolve) => {
        resolve(searchUsername);
      },
      (reject) => {
        reject({ mesaje: "a ocurrido un error" });
      }
    );
  }
  //extra method
  showDetails(_callback) {
    this.routes("/", "showDetails", "GET", _callback);
  }
}
