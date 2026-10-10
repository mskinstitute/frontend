import { NextRequest, NextResponse } from 'next/server';
import { fetchStudents, fetchStudentById } from '@/services/api';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const student = await fetchStudentById(id);
      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }
      return NextResponse.json(student);
    }

    const students = await fetchStudents();
    return NextResponse.json(students);
  } catch (err) {
    console.error('API /api/students error:', err);
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 });
  }
}
