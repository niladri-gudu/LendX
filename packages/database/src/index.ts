import { PrismaClient } from "../generated/prisma/client.js";

export const prisma = new PrismaClient({
    log: ["error", "warn"],
});

export * from "../generated/prisma/client.js";
