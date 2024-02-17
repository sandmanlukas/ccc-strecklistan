import { AccountRole, UserRole } from "@prisma/client";
import { prisma } from "../app/lib/db";
import { faker} from "@faker-js/faker";
const bcrypt = require("bcryptjs");


interface FakeUser {
  username: string;
  password: string;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
}


export function createRandomUser(role: UserRole): FakeUser {
  return {
    username: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: role,
  };
}

async function createAndAddUsersToDatabase() {
  const roles = Object.values(UserRole);
  for (let i = 0; i < 10; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
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

  const user = await prisma.account.upsert({
    where: {
      username: "admin",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "admin",
      password: hashedPassword,
      role: AccountRole.ADMIN,
    },
  });

  
  await prisma.account.upsert({
    where: {
      username: "ccc",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "ccc",
      password: hashedPassword,
      role: AccountRole.CCC,
    },
  });

  await createAndAddUsersToDatabase();
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
