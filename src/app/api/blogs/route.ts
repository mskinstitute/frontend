import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/server-blogs';

export const revalidate = 3600;

export async function GET() {
  try {
    const blogs = await getAllBlogPosts();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('API /api/blogs error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
