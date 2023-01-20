import { DB } from "@DB/index";
export class Model {
  private tableName: string = "modules";
  private DB = new DB(this.tableName);

  async findOne(code: string) {
    let result;
    await this.DB.select()
      .where(`code = '${code}'::character varying`)
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
