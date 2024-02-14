import { User, UserRole } from "@prisma/client";
import { prisma } from "../app/lib/db";
import { faker} from "@faker-js/faker";
const bcrypt = require("bcryptjs");


interface FakeUser {
  username: string;
  password: string;
  role: "USER" | "ADMIN" | "CCC";
  isKadaver: boolean;
  email: string;
  firstName: string;
  lastName: string;
}


export function createRandomUser(role: UserRole): FakeUser {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    role: role,
    isKadaver: faker.datatype.boolean(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  };
}

async function createAndAddUsersToDatabase(role: UserRole) {
  for (let i = 0; i < 10; i++) {
    const randomUser = createRandomUser(role); // You can specify the role here
    // Add the user to the database using your database logic
    // Example: await prisma.user.create({ data: randomUser });
    await prisma.user.create({ data: randomUser });
  }
}

async function main() {
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin",
    10
  );

  const user = await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "admin",
      password: hashedPassword,
      email: "admin@cortegen.se",
      firstName: "Admin",
      lastName: "Adminsson",
      role: "ADMIN",
      isKadaver: false,
    },
  });

  
  await prisma.user.upsert({
    where: {
      username: "ccc",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "ccc",
      password: hashedPassword,
      email: "ccc@cortegen.se",
      firstName: "CCC",
      lastName: "CCCsson",
      role: "CCC",
      isKadaver: false,
    },
  });

  await createAndAddUsersToDatabase("USER");
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
