import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import ProfileSidebar from './components/ProfileSidebar';

// HTML 태그를 제거하는 함수
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
}

// PrismaClient 인스턴스 생성
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // 개발 환경에서 여러 PrismaClient 인스턴스 방지
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    // 데이터베이스에서 게시물 가져오기
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return (
      <div className="flex flex-col md:flex-row gap-8">
        {/* 사이드바 (모바일에서는 상단, 데스크톱에서는 왼쪽에 배치) */}
        <div className="md:w-1/4">
          <ProfileSidebar />
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-8">최근 게시물</h1>
          
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => {
                // HTML 태그를 제거한 내용으로 변환
                const cleanContent = stripHtml(post.content);
                
                return (
                  <div key={post.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <Link href={`/posts/${post.id}`}>
                      <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">{post.title}</h2>
                    </Link>
                    <p className="text-gray-600 mb-4">
                      {cleanContent.length > 200
                        ? `${cleanContent.substring(0, 200)}...`
                        : cleanContent}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{post.author?.name || '익명'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border rounded-lg p-10 text-center bg-gray-50">
              <p className="text-gray-500 mb-4">아직 작성된 게시물이 없습니다.</p>
              <Link 
                href="/posts/create" 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
              >
                첫 글 작성하기
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Database query error:", error);
    // 오류 발생 시 기본 UI 반환
    return (
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="bg-white border rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold dark:text-white">블로그</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">블로그 정보를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        </div>
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-8">최근 게시물</h1>
          <div className="border rounded-lg p-10 text-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">게시물을 불러오는 중 오류가 발생했습니다.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">잠시 후 다시 시도해 주세요.</p>
          </div>
        </div>
      </div>
    );
  }
}