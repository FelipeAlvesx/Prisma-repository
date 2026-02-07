import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { adapter } from "./db-config.js";

const prisma = new PrismaClient({ adapter });

async function test() {
    const users = await prisma.users.findUnique({
        omit: { password: true },
        where: { id: 1, active: true },
    });
    return users;
}

test()
    .then(console.log)
    .finally(async () => prisma.$disconnect());
