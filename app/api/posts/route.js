import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../lib/auth';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  const filters = {};
  if (category) {
    filters.category = category;
  }
  
  try {
    const posts = await prisma.post.findMany({
      where: filters,
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { message: '포스트를 가져오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session || !session.user.isAdmin) {
        return NextResponse.json(
          { message: '관리자만 글을 작성할 수 있습니다.' },
          { status: 403 }
        );
      }
  
      const body = await request.json();
      const { title, content, category } = body;
  
      if (!title || !content) {
        return NextResponse.json(
          { message: '제목과 내용은 필수입니다.' },
          { status: 400 }
        );
      }
  
      const post = await prisma.post.create({
        data: {
          title,
          content,
          category,
          author: { connect: { id: session.user.id } },
        },
      });
  
      return NextResponse.json(post, { status: 201 });
    } catch (error) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { message: '글 작성 중 오류가 발생했습니다: ' + error.message },
        { status: 500 }
      );
    }
  }