const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function resetAllProductRatings() {
  try {
    console.log('🔄 Starting product rating reset...');
    
    const products = await prisma.product.findMany({
      select: { id: true, name: true, rating: true, reviews: true }
    });

    console.log(`📊 Found ${products.length} products to update`);

    for (const product of products) {
      console.log(`\n🔍 Processing: ${product.name} (current: ${product.rating}⭐, ${product.reviews} reviews)`);
      
      // Get approved reviews for this product
      const approvedReviews = await prisma.review.findMany({
        where: {
          productId: product.id,
          approved: true
        }
      });

      const reviewCount = approvedReviews.length;
      const averageRating = reviewCount > 0 
        ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

      // Update the product
      await prisma.product.update({
        where: { id: product.id },
        data: {
          rating: averageRating,
          reviews: reviewCount
        }
      });

      console.log(`✅ Updated ${product.name}: ${averageRating}⭐ (${reviewCount} reviews)`);
    }

    console.log(`\n🎉 Successfully reset ratings for ${products.length} products`);
  } catch (error) {
    console.error('❌ Error resetting product ratings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAllProductRatings();
