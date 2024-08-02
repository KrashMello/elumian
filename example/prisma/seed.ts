import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  await prisma.users.create({
    data: {
      username: "jesoteldo".toUpperCase(),
      password: await bcrypt.hash("admin", 12),
      roles: {
        create: {
          name: "administrador".toUpperCase(),
          description: "rol que posee todos los permisos dentro del sistema",
          role_permissions: {
            create: [
              {
                name: "dashboard_menu".toUpperCase(),
                status: true,
              },
              {
                name: "products_menu".toUpperCase(),
                status: true,
              },
              {
                name: "users_menu".toUpperCase(),
                status: true,
              },
              {
                name: "users_add".toUpperCase(),
                status: true,
              },
              {
                name: "users_update".toUpperCase(),
                status: true,
              },
              {
                name: "products_add".toUpperCase(),
                status: true,
              },
              {
                name: "products_update".toUpperCase(),
                status: true,
              },
            ],
          },
        },
      },
      status: {
        create: {
          name: "activo".toUpperCase(),
          description:
            "estatus asociado a los usuarios luego de la verificacion".toUpperCase(),
        },
      },
      user_personal_data: {
        create: {
          first_name: "system".toUpperCase(),
          last_name: "admin".toUpperCase(),
          address:
            "su casita al lado de la otra casa que esta mas alla S/N".toUpperCase(),
          phone_number: "000000000",
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
