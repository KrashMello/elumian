// import { AuthController } from '@src/controllers/auth/auth.controller'
import { AuthController } from '@src/controllers/auth/auth.controller'
import { TaskController } from '@src/controllers/task/task.controller'
import { UserController } from '@src/controllers/users/user.controller'

export const controllers = [TaskController, UserController, AuthController]
