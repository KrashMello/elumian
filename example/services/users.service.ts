import { Services } from "elumian/decorators";
import { Elumian } from "elumian";

@Services("user")
export class UserService {
  async findAll(searchFilter: string) {
    const elumian = Elumian.getInstance();
    return await elumian.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
      where: {
        OR: [
          {
            name: {
              contains: searchFilter,
            },
            email: {
              contains: searchFilter,
            },
          },
        ],
      },
    });
  }

  async create(data: { name: string; email: string }) {
    const elumian = Elumian.getInstance();
    return await elumian.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  async update(data: { id: number; name: string }) {
    const elumian = Elumian.getInstance();
    return await elumian.prisma.user.update({
      data: {
        name: data.name,
      },
      where: {
        id: data.id,
      },
    });
  }
}
