import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const org = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    update: {},
    create: {
      name: "Demo Organization",
      slug: "demo-org",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@pignaudit.com" },
    update: {},
    create: {
      email: "admin@pignaudit.com",
      name: "Admin User",
      role: UserRole.ADMIN,
      organizationId: org.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "auditor@pignaudit.com" },
    update: {},
    create: {
      email: "auditor@pignaudit.com",
      name: "Demo Auditor",
      role: UserRole.AUDITOR,
      organizationId: org.id,
    },
  });

  console.log("Database seeded successfully");
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
