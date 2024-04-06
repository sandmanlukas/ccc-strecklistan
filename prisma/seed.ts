import { AccountRole, Item, User, UserRole } from "@prisma/client";
import { prisma } from "../app/lib/db";
import { faker } from "@faker-js/faker";
const bcrypt = require("bcryptjs");
import { DEFAULT_AVATAR_URL, BEERED_BARCODE } from "../app/constants";


interface FakeUser {
  username: string;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}


export function createRandomUser(role: UserRole): FakeUser {
  return {
    username: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    role: role,
    avatar: DEFAULT_AVATAR_URL,
  };
}

async function createAndAddUsersToDatabase() {
  let users = [];
  const roles = Object.values(UserRole);
  for (let i = 0; i < 10; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const randomUser = createRandomUser(role); // You can specify the role here
    // Add the user to the database using your database logic
    // Example: await prisma.user.create({ data: randomUser });
    const user = await prisma.user.create({ data: randomUser });
    users.push(user);
  }
  return users;
}

async function createAndAddItemsToDatabase() {
  let items = [];
  for (let i = 0; i < 10; i++) {
    const randomItem = {
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()), // Convert price to number
      volume: faker.number.int({min: 1, max: 100}),
      barcode: faker.string.uuid(),
    };
    // Add the item to the database using your database logic
    // Example: await prisma.item.create({ data: randomItem });
    const item =  await prisma.item.create({ data: randomItem });
    items.push(item);
  }
  return items;
}

async function createFakeTransactions(items: Item[], users: User[]) {
  for (let i = 0; i < 30; i++) {
    const barcode = items[Math.floor(Math.random() * items.length)].barcode;
    const user = users[Math.floor(Math.random() * users.length)].id;
    const randomTransaction = {
      userId: user,
      barcode: barcode,
      beeredTransaction: false,
      price: faker.number.int({min:15, max: 100}),
      beeredUser: null,
      beeredBy: null,
    };

    await prisma.transaction.create({ data: randomTransaction });
  }
}

async function main() {
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.transaction.deleteMany({});

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

  await prisma.item.upsert({
    where: {
      barcode: BEERED_BARCODE,
    },
    update: {
      name: "Bärsning",
      price: 0,
      volume: 0,
    },
    create: {
      name: "Bärsning",
      price: 0,
      volume: 0,
      barcode: BEERED_BARCODE,
    },
  });

  await prisma.swish.upsert({
    where: {
      id: 1,
    },
    update: {
      name: "Test Testsson",
      number: "1234567890",
    },
    create: {
      name: "Test Testsson",
      number: "1234567890",
    },
  });

  const users = await createAndAddUsersToDatabase();
  const items = await createAndAddItemsToDatabase();
  await createFakeTransactions(items, users);
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
