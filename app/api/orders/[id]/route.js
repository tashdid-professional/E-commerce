import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET single order by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT update order status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
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
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Delete order items first (due to foreign key constraint)
    await prisma.orderItem.deleteMany({
      where: { orderId: parseInt(id) }
    });
    
    // Delete the order
    await prisma.order.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
