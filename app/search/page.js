import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import ProfileSidebar from '../components/ProfileSidebar';

const prisma = new PrismaClient();

// HTML 태그를 제거하는 함수
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || '';
  
  // 검색어가 비어있으면 빈 결과
  if (!query.trim()) {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <ProfileSidebar />
        </div>
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-4">검색 결과</h1>
          <p>검색어를 입력해주세요.</p>
        </div>
      </div>
    );
  }
  
  // 데이터베이스에서 검색어와 일치하는 게시물 찾기
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ]
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/4">
        <ProfileSidebar />
      </div>
      
      <div className="md:w-3/4">
        <h1 className="text-3xl font-bold mb-4">"{query}" 검색 결과</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">총 {posts.length}개의 게시물을 찾았습니다.</p>
        
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
          <div className="border rounded-lg p-10 text-center bg-gray-50 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400 mb-4">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}