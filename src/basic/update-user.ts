import "dotenv/config";
import { PrismaClient, type Users } from "@prisma/client";
import { adapter } from "./db-config.js";

const prisma = new PrismaClient({ adapter });

async function test() {
    const user: Users = {
        id: 5,
        name: "machado de assis pereira",
        email: "machado.pereira@email.com",
        password:
            "$2a$12$fW/bDKfYWWYgL/Ywcb4j2.6xXfhGKtVUbG0fbpteGaWKmhEHUOGwG",
        active: true,
    };
    const result = await prisma.users.upsert({
        create: user,
        update: user,
        where: { id: user.id ?? -1 },
    });

    return result;
}

test()
    .then(console.log)
    .finally(async () => prisma.$disconnect());
