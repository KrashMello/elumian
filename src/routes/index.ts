import { router } from '@router/index'
import { AuthController } from '@src/controllers/auth/auth.controller'
// import { TaskController } from '@src/controllers/task/task.controller'

const controllers = [AuthController]

export default router(controllers)
