import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all orders (with optional user filtering)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');
    
    let whereClause = {};
    
    // If userId is provided, filter by user ID
    if (userId) {
      whereClause.userId = parseInt(userId);
    }
    
    // If userEmail is provided, filter by email (fallback)
    if (userEmail && !userId) {
      whereClause.email = userEmail;
    }
    
    const orders = await prisma.order.findMany({
      where: whereClause,
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
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST create new order
export async function POST(request) {
  try {
    const { customer, email, items, total, userId } = await request.json();
    
    // Validate required fields
    if (!customer || !email || !items || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create order with items
    const order = await prisma.order.create({
      data: {
        customer,
        email,
        total,
        status: 'pending',
        userId: userId ? parseInt(userId) : null, // Link to user if provided
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
