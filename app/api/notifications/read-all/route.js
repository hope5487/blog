import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../../lib/auth';

const prisma = new PrismaClient();

// 모든 알림을 읽음으로 표시
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: '인증이 필요합니다' }, { status: 401 });
  }
  
  try {
    // 사용자의 모든 알림 읽음 처리
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false
      },
      data: {
        read: true
      }
    });
    
    return NextResponse.json({ message: '모든 알림이 읽음으로 표시되었습니다' });
  } catch (error) {
    console.error('모든 알림 읽음 처리 중 오류 발생:', error);
    return NextResponse.json(
      { message: '알림 읽음 처리에 실패했습니다' },
      { status: 500 }
    );
  }
}