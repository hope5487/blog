import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// 사용자의 알림 목록 가져오기
export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: '인증이 필요합니다' }, { status: 401 });
  }
  
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('알림 조회 중 오류 발생:', error);
    return NextResponse.json(
      { message: '알림을 가져오는 데 실패했습니다' },
      { status: 500 }
    );
  }
}

// 알림 삭제
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: '인증이 필요합니다' }, { status: 401 });
  }
  
  // URL에서 알림 ID 추출
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { message: '알림 ID가 필요합니다' },
      { status: 400 }
    );
  }
  
  try {
    // 알림 삭제 전 소유권 확인
    const notification = await prisma.notification.findUnique({
      where: {
        id
      }
    });
    
    if (!notification) {
      return NextResponse.json(
        { message: '알림을 찾을 수 없습니다' },
        { status: 404 }
      );
    }
    
    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { message: '이 알림을 삭제할 권한이 없습니다' },
        { status: 403 }
      );
    }
    
    // 알림 삭제
    await prisma.notification.delete({
      where: {
        id
      }
    });
    
    return NextResponse.json({ message: '알림이 삭제되었습니다' });
  } catch (error) {
    console.error('알림 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { message: '알림 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}