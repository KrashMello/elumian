import { Services } from "@elumian/decorators";
import { Elumian } from "@elumian";

@Services("user")
export class UserService {
  async findAll() {
    // const elumian = Elumian.getInstance();
    // return await elumian.prisma.user.findMany();
  }
}
