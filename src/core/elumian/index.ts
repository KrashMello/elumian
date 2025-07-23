import Cache from "../cache";
import Crypto from "../crypto";
import { elumian } from "../type";
//@ts-ignore
import { PrismaClient } from "@prisma/client";

export const Elumian: elumian = {
  prisma: new PrismaClient(),
  cache: Cache,
  crypto: Crypto,
};
