import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all products with their categories
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
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
        category: true
      }
    });
    
    if (!product) return null;
    
    return {
      ...product,
      category: product.category.name
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
export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      include: {
        category: true
      }
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
        categoryId: category.id,
        description: productData.description,
        features: productData.features,
        rating: productData.rating || 5,
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
