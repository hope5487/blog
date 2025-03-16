import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// 특정 알림을 읽음으로 표시
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: '인증이 필요합니다' }, { status: 401 });
  }
  
  const id = params.id;
  
  try {
    // 알림 존재 및 소유권 확인
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
        { message: '이 알림을, 읽음으로 표시할 권한이 없습니다' },
        { status: 403 }
      );
    }
    
    // 알림 읽음 처리
    const updatedNotification = await prisma.notification.update({
      where: {
        id
      },
      data: {
        read: true
      }
    });
    
    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('알림 읽음 처리 중 오류 발생:', error);
    return NextResponse.json(
      { message: '알림 읽음 처리에 실패했습니다' },
      { status: 500 }
    );
  }
}