import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import CommentSection from '../../components/CommentSection';
import DeletePostButton from '../../components/DeletePostButton';

const prisma = new PrismaClient();

export default async function PostPage({ params }) {
  // params를 Promise로 처리
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  
  const session = await getServerSession(authOptions);
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });
  
  if (!post) {
    notFound();
  }
  
  // 카테고리 매핑
  const categoryNames = {
    'dev': '개발',
    'tech': '기술',
    'life': '일상'
  };
  
  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Link href="/" className="text-blue-600 hover:underline">&larr; 목록으로 돌아가기</Link>
        </div>
        
        <article className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-8 shadow-sm">
            <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">{post.title}</h1>
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <div>
                <span>작성자: {post.author.name}</span>
                {post.category && (
                    <span className="ml-4">
                    카테고리: <Link href={`/category/${post.category}`} className="text-blue-600 hover:underline">
                        {categoryNames[post.category] || post.category}
                    </Link>
                    </span>
                )}
                </div>
                <time dateTime={new Date(post.createdAt).toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString()}
                </time>
            </div>
            </header>
            
            <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {session?.user?.isAdmin && (
            <div className="mt-8 pt-6 border-t dark:border-gray-700 flex gap-4">
                <Link 
                href={`/posts/${id}/edit`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                수정하기
                </Link>
                <DeletePostButton postId={id} />
            </div>
            )}
        </article>
        
        {/* 댓글 섹션 */}
        <div className="mt-8 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-8 shadow-sm">
            <CommentSection postId={id} postTitle={post.title} />
        </div>
    </div>
  );
}