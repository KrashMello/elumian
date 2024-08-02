import { Service } from "@elumian/decorators";
import { Elumian } from "@elumian";
import { singCacheData } from "@elumian/cache";
import bcrypt from "bcrypt";

@Service
export class Auth {
  async login(data: { username: string; password: string }) {
    const userData = await Elumian.prisma.users.findUnique({
      select: {
        password: true,
        user_personal_data: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        status: {
          select: {
            name: true,
          },
        },
        roles: {
          select: {
            name: true,
            role_permissions: {
              select: {
                name: true,
                status: true,
              },
            },
          },
        },
      },
      where: {
        username: data.username,
      },
    });
    if (userData) {
      const comparePassword = bcrypt.compareSync(
        data.password,
        userData.password,
      );

      if (comparePassword) {
        delete userData.password;
        return singCacheData("Auth", userData);
      } else {
        throw new Error("Contraseña invalida");
      }
    } else {
      throw new Error("nombre de usuario invalido");
    }
  }
}
