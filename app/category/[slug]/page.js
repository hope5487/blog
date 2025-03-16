import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import ProfileSidebar from '../../components/ProfileSidebar';

const prisma = new PrismaClient();

export default async function CategoryPage({ params }) {
  // params를 await로 처리
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  // 카테고리명 매핑 (URL slug -> 표시명)
  const categoryNames = {
    'dev': '개발',
    'tech': '기술',
    'life': '일상'
  };
  
  const categoryName = categoryNames[slug] || slug;
  
  // 해당 카테고리의 게시물 가져오기
  const posts = await prisma.post.findMany({
    where: {
      category: slug
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
      {/* 사이드바 */}
      <div className="md:w-1/4">
        <ProfileSidebar />
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="md:w-3/4">
        <h1 className="text-3xl font-bold mb-8">{categoryName} 게시물</h1>
        
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">{post.title}</h2>
                </Link>
                <p className="text-gray-600 mb-4">
                  {post.content.length > 200
                    ? `${post.content.substring(0, 200)}...`
                    : post.content}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{post.author?.name || '익명'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg p-10 text-center bg-gray-50">
            <p className="text-gray-500 mb-4">이 카테고리에 게시물이 없습니다.</p>
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
}