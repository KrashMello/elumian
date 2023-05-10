import { DB } from "@DB/index";
export abstract class Model {
  protected tableName: string = "employed";
  public DB;
  constructor() {
    this.DB = new DB(this.tableName);
  }
  async findOne(code: string) {
    let result: object = {};
    await this.DB.select()
      .where(`"code" = '${code}'::character varying`)
      .limit(1)
      .exec()
      .then((resp) => {
        result = resp.rows[0];
      })
      .catch((err) => {
        console.log(err);
      });
    return result;
  }
}
