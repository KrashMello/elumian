import { Model } from "#Class/model";

export class Users extends Model {
    showDetails(_callback) {
        this.app.get("/showDetails", _callback);
    }
}
