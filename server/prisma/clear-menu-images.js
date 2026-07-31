const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing menu item imageUrl fields...');
  const result = await prisma.menuItem.updateMany({ data: { imageUrl: null } });
  console.log(`✅ Cleared imageUrl on ${result.count} menu items`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
