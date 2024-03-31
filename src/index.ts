import { PrismaClient } from "@prisma/client";
import "reflect-metadata";

export class Elumian {
  static instance: Record<string, any> = {};
  static services: any[];
  constructor() {}
  static getInstance(): Record<string, any> {
    if (!this.instance["prisma"])
      this.instance = {
        ...this.instance,
        prisma: new PrismaClient(),
      };
    let aux: [string, any][] = [];
    this.services.forEach((v) => {
      const prefix = Reflect.getMetadata("prefix", v);
      if (!this.instance[prefix]) aux.push([prefix, new v()]);
    });
    this.instance = { ...this.instance, ...Object.fromEntries(aux) };
    return this.instance;
  }
}
