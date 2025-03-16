import Image from 'next/image';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ProfileSidebar() {
  // 각 카테고리별 게시물 수 계산
  const categoryCounts = await prisma.post.groupBy({
    by: ['category'],
    _count: {
      _all: true,
    },
  });
  
  // 전체 게시물 수
  const totalPosts = await prisma.post.count();
  
  // 카테고리 매핑 및 카운트 데이터 구성
  const categories = [
    { id: 'all', name: '전체 글', slug: '/', count: totalPosts },
    { id: 'dev', name: '개발', slug: '/category/dev', count: 0 },
    { id: 'tech', name: '기술', slug: '/category/tech', count: 0 },
    { id: 'life', name: '일상', slug: '/category/life', count: 0 },
  ];
  
  // 데이터베이스에서 가져온 카운트로 업데이트
  categoryCounts.forEach(cat => {
    const category = categories.find(c => c.id === cat.category);
    if (category) {
      category.count = cat._count._all;
    }
  });

  return (
    <div className="bg-white border rounded-lg p-6 sticky top-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white">
          <span className="text-4xl font-bold">RC</span>
        </div>
        <h2 className="text-xl font-bold dark:text-white">로이 초</h2>
        <p className="text-gray-600 dark:text-gray-400">블로그 운영자</p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2 dark:text-white">소개</h3>
        <p className="text-gray-600 text-sm dark:text-gray-400">
          안녕하세요! 개발과 기술에 관심이 많은 블로거입니다. 
          이 블로그에서는 프로그래밍, 웹 개발, 그리고 새로운 기술에 대한 
          이야기를 공유합니다.
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2 dark:text-white">카테고리</h3>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id} className="flex justify-between items-center">
              <Link 
                href={category.slug} 
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {category.name}
              </Link>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-medium mb-2 dark:text-white">소셜 미디어</h3>
        <div className="flex space-x-3 justify-center">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}