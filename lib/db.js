import { PrismaClient } from '@prisma/client';

// Global PrismaClient instance to prevent multiple connections
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Get all products with their categories (optimized for listing)
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform to match your existing data structure
    return products.map(product => ({
      ...product,
      category: product.category.name
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Get all categories
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      count: category._count.products
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Get product by ID
export async function getProductById(id) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        productReviews: {
          where: { approved: true },
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!product) return null;
    
    return {
      ...product,
      category: product.category.name,
      reviewsList: product.productReviews,
      reviews: product.reviews // Keep the number for count
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get products by category
export async function getProductsByCategory(categoryName) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: categoryName
        }
      },
      include: {
        category: true
      }
    });
    
    return products.map(product => ({
      ...product,
      category: product.category.name
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Get featured products (first 4)
// Get featured products (top-rated and recently updated)
export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      include: {
        category: true
      },
      orderBy: [
        { rating: 'desc' },
        { reviews: 'desc' },
        { updatedAt: 'desc' }
      ]
    });
    
    return products.map(product => ({
      ...product,
      category: product.category.name
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// Create a new product
export async function createProduct(productData) {
  try {
    const category = await prisma.category.findUnique({
      where: { name: productData.category }
    });
    
    if (!category) {
      throw new Error(`Category ${productData.category} not found`);
    }
    
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        price: productData.price,
        originalPrice: productData.originalPrice,
        image: productData.image,
        images: productData.images || [],
        categoryId: category.id,
        description: productData.description,
        features: productData.features,
        rating: productData.rating || 0,
        reviews: productData.reviews || 0,
        inStock: productData.inStock !== undefined ? productData.inStock : true
      },
      include: {
        category: true
      }
    });
    
    return {
      ...product,
      category: product.category.name
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Update a product
export async function updateProduct(id, productData) {
  try {
    let categoryId = undefined;
    
    if (productData.category) {
      const category = await prisma.category.findUnique({
        where: { name: productData.category }
      });
      
      if (!category) {
        throw new Error(`Category ${productData.category} not found`);
      }
      
      categoryId = category.id;
    }
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(productData.name && { name: productData.name }),
        ...(productData.price && { price: productData.price }),
        ...(productData.originalPrice !== undefined && { originalPrice: productData.originalPrice }),
        ...(productData.image && { image: productData.image }),
        ...(productData.images !== undefined && { images: productData.images }),
        ...(categoryId && { categoryId }),
        ...(productData.description && { description: productData.description }),
        ...(productData.features && { features: productData.features }),
        ...(productData.rating && { rating: productData.rating }),
        ...(productData.reviews !== undefined && { reviews: productData.reviews }),
        ...(productData.inStock !== undefined && { inStock: productData.inStock })
      },
      include: {
        category: true
      }
    });
    
    return {
      ...product,
      category: product.category.name
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(id) {
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Create a new category
export async function createCategory(categoryData) {
  try {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name
      }
    });
    
    return {
      id: category.id,
      name: category.name,
      count: 0
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

// Update a category
export async function updateCategory(id, categoryData) {
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name: categoryData.name
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    return {
      id: category.id,
      name: category.name,
      count: category._count.products
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

// Delete a category
export async function deleteCategory(id) {
  try {
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// User management functions
export async function createUser(userData) {
  try {
    const user = await prisma.user.create({
      data: userData
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Order management functions with user support
export async function createOrder(orderData) {
  try {
    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrdersByUser(userId) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

// Review functions
export async function createReview(reviewData) {
  try {
    const review = await prisma.review.create({
      data: {
        rating: reviewData.rating,
        comment: reviewData.comment || '',
        userId: reviewData.userId,
        productId: reviewData.productId,
        approved: false
      },
      include: {
        user: true,
        product: true
      }
    });

    // Update product rating and review count
    await updateProductRating(reviewData.productId);

    return review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

export async function getReviewsByProduct(productId) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: parseInt(productId),
        approved: true
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function getAllReviews() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        product: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return reviews;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }
}

export async function approveReview(reviewId) {
  try {
    const review = await prisma.review.update({
      where: { id: parseInt(reviewId) },
      data: { approved: true },
      include: {
        product: true
      }
    });

    // Update product rating after approval
    await updateProductRating(review.productId);

    return review;
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
}

export async function deleteReview(reviewId) {
  try {
    const review = await prisma.review.delete({
      where: { id: parseInt(reviewId) },
      include: {
        product: true
      }
    });

    // Update product rating after deletion
    await updateProductRating(review.productId);

    return review;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

async function updateProductRating(productId) {
  try {
    const approvedReviews = await prisma.review.findMany({
      where: {
        productId: parseInt(productId),
        approved: true
      }
    });

    const reviewCount = approvedReviews.length;
    const averageRating = reviewCount > 0 
      ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        rating: averageRating,
        reviews: reviewCount
      }
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

// Reset all product ratings based on actual reviews
export async function resetAllProductRatings() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true }
    });

    for (const product of products) {
      await updateProductRating(product.id);
    }

    console.log(`Reset ratings for ${products.length} products`);
    return { success: true, message: `Reset ratings for ${products.length} products` };
  } catch (error) {
    console.error('Error resetting product ratings:', error);
    throw error;
  }
}

export async function checkUserCanReview(userId, productId) {
  try {
    // Check if user has ordered this product
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId: parseInt(productId),
        order: {
          userId: parseInt(userId)
        }
      }
    });

    if (!orderItem) {
      return { canReview: false, reason: 'You must purchase this product before reviewing it.' };
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId)
        }
      }
    });

    if (existingReview) {
      return { canReview: false, reason: 'You have already reviewed this product.' };
    }

    return { canReview: true };
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return { canReview: false, reason: 'Error checking review eligibility.' };
  }
}
