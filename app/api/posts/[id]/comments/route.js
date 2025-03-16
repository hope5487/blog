import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from "../../../../lib/auth";

const prisma = new PrismaClient();

// 게시물의 댓글 목록 가져오기
export async function GET(request, { params }) {
  // params를 Promise로 처리
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  
  try {
    const comments = await prisma.comment.findMany({
    where: {
      postId: id
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return NextResponse.json(comments);
  } catch (error) {
    console.error('댓글 조회 중 오류 발생:', error);
    return NextResponse.json(
      { message: '댓글을 가져오는 데 실패했습니다' },
      { status: 500 }
    );
  }
}

// 새 댓글 작성
export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: '로그인이 필요합니다' }, { status: 401 });
  }
  
  // params를 Promise로 처리하여 비동기적으로 액세스
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  
  try {
    const { content, postTitle } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { message: '댓글 내용은 필수입니다' },
        { status: 400 }
      );
    }
    
    // 포스트 작성자 정보 가져오기
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });
    
    if (!post) {
      return NextResponse.json(
        { message: '게시물을 찾을 수 없습니다' },
        { status: 404 }
      );
    }
    
    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id } },
        author: { connect: { id: session.user.id } }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    // 게시물 작성자와 댓글 작성자가 다른 경우 알림 생성
    if (post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: 'comment',
          message: `새로운 댓글: "${content.length > 30 ? content.substring(0, 30) + '...' : content}"`,
          userId: post.authorId,
          postId: id,
          postTitle: postTitle
        }
      });
    }
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('댓글 작성 중 오류 발생:', error);
    return NextResponse.json(
      { message: '댓글 작성에 실패했습니다' },
      { status: 500 }
    );
  }
}