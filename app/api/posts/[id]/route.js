import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// 특정 게시물 가져오기
export async function GET({ params }) {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
  
    try {
        const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
            select: {
                id: true,
                name: true,
                image: true,
            },
            },
        },
        });
        
        if (!post) {
        return NextResponse.json(
            { message: '게시물을 찾을 수 없습니다' },
            { status: 404 }
        );
        }
        
        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
        { message: '게시물을 가져오는 데 실패했습니다' },
        { status: 500 }
        );
    }
}

// 게시물 수정
export async function PUT(request, { params }) {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
  
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.isAdmin) {
        return NextResponse.json(
        { message: '관리자만 글을 수정할 수 있습니다' },
        { status: 403 }
        );
    }
    
    try {
        // 게시물 존재 확인
        const existingPost = await prisma.post.findUnique({
        where: { id },
        });
        
        if (!existingPost) {
        return NextResponse.json(
            { message: '게시물을 찾을 수 없습니다' },
            { status: 404 }
        );
        }
        
        // 요청 본문 파싱
        const { title, content, category } = await request.json();
        
        if (!title || !content) {
        return NextResponse.json(
            { message: '제목과 내용은 필수입니다' },
            { status: 400 }
        );
        }
        
        // 게시물 업데이트
        const updatedPost = await prisma.post.update({
        where: { id },
        data: {
            title,
            content,
            category,
            updatedAt: new Date(),
        },
        });
        
        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
        { message: '게시물 수정에 실패했습니다: ' + error.message },
        { status: 500 }
        );
    }
}

// 게시물 삭제
export async function DELETE( { params }) {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.isAdmin) {
        return NextResponse.json(
        { message: '관리자만 글을 삭제할 수 있습니다' },
        { status: 403 }
        );
    }
    
    try {
        // 게시물 존재 확인
        const existingPost = await prisma.post.findUnique({
        where: { id },
        });
        
        if (!existingPost) {
        return NextResponse.json(
            { message: '게시물을 찾을 수 없습니다' },
            { status: 404 }
        );
        }
        
        // 게시물 삭제
        await prisma.post.delete({
        where: { id },
        });
        
        return NextResponse.json({ message: '게시물이 삭제되었습니다' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
        { message: '게시물 삭제에 실패했습니다: ' + error.message },
        { status: 500 }
        );
    }
}