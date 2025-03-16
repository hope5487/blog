import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import EditPostForm from '../../../components/EditPostForm';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function EditPostPage({ params }) {
  // 서버 컴포넌트에서 params 사용 - 문제 없음
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  const session = await getServerSession(authOptions);
  
  // 관리자 확인
  if (!session || !session.user.isAdmin) {
    return (
      <div className="container mx-auto my-10 p-5 text-center">
        <h1 className="text-xl font-bold">접근 권한이 없습니다.</h1>
        <p>관리자만 글을 수정할 수 있습니다.</p>
        <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }
  
  // 게시물 데이터 조회
  const post = await prisma.post.findUnique({
    where: { id },
  });
  
  // 게시물이 없으면 404
  if (!post) {
    notFound();
  }
  
  // 클라이언트 컴포넌트에 postId와 초기 데이터 전달
  return <EditPostForm postId={id} initialData={post} />;
}