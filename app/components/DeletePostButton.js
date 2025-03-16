"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeletePostButton({ postId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('정말 이 글을 삭제하시겠습니까?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        try {
          const errorData = await res.json();
          alert(`오류: ${errorData.message || '알 수 없는 오류'}`);
        } catch {
          alert(`오류: 서버 응답 상태 ${res.status}`);
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('글 삭제 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
    >
      {isDeleting ? '삭제 중...' : '삭제하기'}
    </button>
  );
}