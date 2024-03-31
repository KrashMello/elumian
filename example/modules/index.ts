import { UserService } from "example/services/users.model";
import { UserController } from "../controllers/users/user.controller";

export default {
  controllers: [UserController],
  services: [UserService],
};
