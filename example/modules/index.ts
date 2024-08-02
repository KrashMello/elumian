import { AuthController } from "../controllers/auth/auth.controller";
import { Auth } from "../services/auth.service";

export default {
  controllers: [AuthController],
  services: [Auth],
};
