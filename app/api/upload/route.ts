import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не знайдено' }, { status: 400 });
    }

    // Конвертуємо файл в base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Завантажуємо в Cloudinary
    const result = await uploadImage(base64);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error('Помилка завантаження:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження зображення' },
      { status: 500 }
    );
  }
}