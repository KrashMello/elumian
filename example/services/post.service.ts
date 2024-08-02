import { Services } from "elumian/decorators";
import { Elumian } from "elumian";

@Services("post")
export class PostService {
  async findAll() {
    const elumian = Elumian.getInstance();
    return await elumian.prisma.post.findMany();
  }

  async create() {
    return "";
  }

  async update() {
    return "";
  }
}
