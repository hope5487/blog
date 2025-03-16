"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function CommentSection({ postId, postTitle }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error('댓글을 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // 댓글 작성 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, postTitle }),
      });
      
      if (res.ok) {
        const newComment = await res.json();
        setComments(prevComments => [newComment, ...prevComments]);
        setContent('');
      } else {
        const error = await res.json();
        alert(`오류: ${error.message}`);
      }
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 삭제 핸들러
  const handleDelete = async (commentId) => {
    if (confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      try {
        const res = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        });
        
        if (res.ok) {
          setComments(comments.filter(comment => comment.id !== commentId));
        } else {
          const error = await res.json();
          alert(`오류: ${error.message}`);
        }
      } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        alert('댓글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 시간 표시 포맷팅 함수
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return '방금 전';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">댓글</h3>
      
      {/* 댓글 작성 폼 */}
      {status === 'authenticated' ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start">
            {session.user.image && (
              <img 
                src={session.user.image}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div className="flex-grow">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="w-full p-3 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                rows="3"
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                >
                  {isSubmitting ? '등록 중...' : '댓글 등록'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            댓글을 작성하려면 <Link href="/api/auth/signin" className="text-blue-500 hover:underline">로그인</Link>이 필요합니다.
          </p>
        </div>
      )}
      
      {/* 댓글 목록 */}
      {loading ? (
        <div className="text-center py-4">댓글 로딩 중...</div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="p-4 border rounded dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {comment.author?.image ? (
                    <img 
                      src={comment.author.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-2 flex items-center justify-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {comment.author?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{comment.author?.name || '익명'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(comment.createdAt)}
                    </div>
                  </div>
                </div>
                {(session?.user?.id === comment.authorId || session?.user?.isAdmin) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                    title="삭제"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-line">{comment.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
        </div>
      )}
    </div>
  );
}