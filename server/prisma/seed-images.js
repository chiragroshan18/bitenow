const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sample restaurant images (replace with your actual BNX AI or Cloudinary/Unsplash URLs)
const restaurantImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541542684-4b5f9a9c1a22?w=800&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498654200974-3a3a1a8b0bbf?w=800&h=500&fit=crop&q=80',
];

async function main() {
  console.log('🖼️ Adding images to restaurants...');
  const restaurants = await prisma.restaurant.findMany();
  for (let i = 0; i < restaurants.length; i++) {
    await prisma.restaurant.update({
      where: { id: restaurants[i].id },
      data: { imageUrl: restaurantImages[i % restaurantImages.length] },
    });
  }
  console.log(`✅ ${restaurants.length} restaurants updated`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
