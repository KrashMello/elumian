import { PrismaClient } from "@prisma/client";
import "reflect-metadata";
import Cache from "./cache";
import Crypto from "./crypto";

export type elumian = Record<string, any>;

export const Elumian: elumian = {
  prisma: new PrismaClient(),
  cache: Cache,
  crypto: Crypto,
};
