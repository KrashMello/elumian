import Cache from "../cache";
import Crypto from "../crypto";
import { elumian } from "../type";

export const Elumian: elumian = {
  // prisma: new PrismaClient(),
  cache: Cache,
  crypto: Crypto,
};
