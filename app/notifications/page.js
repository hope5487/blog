"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);
  
  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);
  
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('알림을 가져오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT'
      });
      
      if (res.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
    } catch (error) {
      console.error('알림 읽음 처리 중 오류 발생:', error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PUT'
      });
      
      if (res.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
      }
    } catch (error) {
      console.error('모든 알림 읽음 처리 중 오류 발생:', error);
    }
  };
  
  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }
    } catch (error) {
      console.error('알림 삭제 중 오류 발생:', error);
    }
  };
  
  const deleteAllNotifications = async () => {
    if (confirm('모든 알림을 삭제하시겠습니까?')) {
      try {
        // 각 알림 개별 삭제 (API 엔드포인트 추가 필요)
        const promises = notifications.map(notification => 
          fetch(`/api/notifications?id=${notification.id}`, { method: 'DELETE' })
        );
        
        await Promise.all(promises);
        setNotifications([]);
      } catch (error) {
        console.error('알림 일괄 삭제 중 오류 발생:', error);
      }
    }
  };
  
  if (status === 'loading' || loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }
  
  if (!session) {
    return <div className="text-center py-10">로그인이 필요합니다</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">알림</h1>
        <div className="space-x-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={markAllAsRead}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                모두 읽음으로 표시
              </button>
              <button
                onClick={deleteAllNotifications}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                모두 삭제
              </button>
            </>
          )}
        </div>
      </div>
      
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`border p-4 rounded hover:shadow-md transition-shadow ${!notification.read ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex justify-between">
                <Link 
                  href={`/posts/${notification.postId}`} 
                  onClick={() => markAsRead(notification.id)}
                  className="flex-grow"
                >
                  <div className="text-lg font-medium mb-1">
                    {notification.message}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {notification.postTitle && (
                      <>
                        <span>{notification.postTitle}</span>
                        <span className="mx-1">•</span>
                      </>
                    )}
                    <span>{formatTimeAgo(notification.createdAt)}</span>
                  </div>
                </Link>
                <div className="flex flex-col items-end space-y-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      읽음으로 표시
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded bg-gray-50 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">알림이 없습니다</p>
        </div>
      )}
    </div>
  );
}

// 시간을 '몇 시간 전' 형식으로 표시하는 함수
function formatTimeAgo(dateString) {
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
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}주 전`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}년 전`;
}