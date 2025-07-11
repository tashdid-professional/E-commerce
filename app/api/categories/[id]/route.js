import { NextResponse } from 'next/server';
import { updateCategory, deleteCategory } from '../../../../lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const categoryData = await request.json();
    const category = await updateCategory(id, categoryData);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await deleteCategory(id);
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
