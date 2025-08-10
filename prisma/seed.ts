import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const shop = process.env.DEV_STORE?.replace('https://', '') || 'dev-shop.myshopify.com';
  await prisma.promoBar.upsert({
    where: { id: 1 },
    update: {},
    create: {
      shop,
      message: 'Kostenloser Versand ab 50€',
      bgColor: '#0ea5e9',
      textColor: '#0b1320',
      showOnHome: true,
      active: true,
    },
  });
}

main().finally(async () => prisma.$disconnect()); 