import { prisma } from "../app/lib/db";
const bcrypt = require("bcryptjs");


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
      role: "ADMIN",
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
      role: "CCC",
    },
  });



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
