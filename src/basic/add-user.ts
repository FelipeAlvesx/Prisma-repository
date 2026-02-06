import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { adapter } from "./db-config.js";

const prisma = new PrismaClient({ adapter });

async function test() {
    await prisma.users.create({
        data: {
            name: "Lorran Dev",
            email: "lorran@email.com",
            password:
                "$2a$12$fW/bDKfYWWYgL/Ywcb4j2.6xXfhGKtVUbG0fbpteGaWKmhEHUOGwG",
        },
    });

    console.log("User creation successfully");
}

test()
    .catch(console.error)
    .finally(async () => prisma.$disconnect());
