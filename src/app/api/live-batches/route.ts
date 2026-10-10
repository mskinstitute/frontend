import { NextResponse } from 'next/server';
import { fetchLiveBatches } from '@/services/api';

export const revalidate = 60;

export async function GET() {
  try {
    const batches = await fetchLiveBatches();
    return NextResponse.json(batches);
  } catch (err) {
    console.error('Failed to fetch live batches in API route:', err);
    return NextResponse.json([], { status: 500 });
  }
}
