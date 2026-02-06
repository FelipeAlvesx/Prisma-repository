import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { adapter } from "./db-config.js";

const prisma = new PrismaClient({ adapter });

async function test() {
    const users = await prisma.users.findMany();
    return users;
}

test()
    .then(console.log)
    .finally(async () => prisma.$disconnect());
