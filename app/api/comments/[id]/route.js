import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// 댓글 삭제
export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({ message: '로그인이 필요합니다' }, { status: 401 });
    }
    
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    try {
        // 댓글 정보 확인
        const comment = await prisma.comment.findUnique({
        where: { id },
        include: { post: true }
        });
        
        if (!comment) {
        return NextResponse.json(
            { message: '댓글을 찾을 수 없습니다' },
            { status: 404 }
        );
        }
        
        // 댓글 작성자 또는 블로그 관리자만 삭제 가능
        if (comment.authorId !== session.user.id && !session.user.isAdmin && comment.post.authorId !== session.user.id) {
        return NextResponse.json(
            { message: '이 댓글을 삭제할 권한이 없습니다' },
            { status: 403 }
        );
        }
        
        // 댓글 삭제
        await prisma.comment.delete({
        where: { id }
        });
        
        return NextResponse.json({ message: '댓글이 삭제되었습니다' });
    } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        return NextResponse.json(
        { message: '댓글 삭제에 실패했습니다' },
        { status: 500 }
        );
    }
}