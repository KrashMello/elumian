import { Model } from '@Model/index'
export class TaskModel extends Model {
  tableName = 'task'
  constructor() {
    super()
  }

  create(data: string[]) {
    return this.DB.call('createTask', data.toString()).exec()
  }
}
