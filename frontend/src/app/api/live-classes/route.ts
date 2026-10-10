import { NextResponse } from 'next/server';
import { fetchLiveClasses } from '@/services/api';

export const revalidate = 60;

export async function GET() {
  try {
    const classes = await fetchLiveClasses();
    return NextResponse.json(classes);
  } catch (err) {
    console.error('Failed to fetch live classes in API route:', err);
    return NextResponse.json([], { status: 500 });
  }
}
