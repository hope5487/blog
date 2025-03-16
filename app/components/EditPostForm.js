"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Youtube from '@tiptap/extension-youtube';
import MenuBar from './MenuBar';

export default function EditPostForm({ postId, initialData }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title || '');
  const [category, setCategory] = useState(initialData.category || 'dev');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
      CodeBlock,
      Youtube.configure({
        width: 640,
        height: 360,
        controls: true,
      }),
    ],
    content: initialData.content || '',
  });
  
  // 글 수정 함수
  const updatePost = async (e) => {
    e.preventDefault();
    if (!editor) return;
    
    setIsSubmitting(true);
    const content = editor.getHTML();
    
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, category }),
      });
      
      if (res.ok) {
        router.push(`/posts/${postId}`);
        router.refresh();
      } else {
        try {
          const errorText = await res.text();
          let errorMessage = `오류: 상태 코드 ${res.status}`;
          
          if (errorText) {
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = `오류: ${errorJson.message || errorJson}`;
            } catch {
              errorMessage = `오류: ${errorText}`;
            }
          }
          
          alert(errorMessage);
        } catch (e) {
          alert(`오류: 서버에서 응답을 받을 수 없습니다 (${res.status})`);
        }
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert(`글 수정 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 오류 발생 시
  if (error) {
    return (
      <div className="container mx-auto my-10 p-5 text-center">
        <h1 className="text-xl font-bold text-red-500">{error}</h1>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto my-10 p-5">
      <h1 className="text-2xl font-bold mb-5">글 수정하기</h1>
      <form onSubmit={updatePost} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <label className="block mb-2 font-medium">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="dev">개발</option>
            <option value="tech">기술</option>
            <option value="life">일상</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">내용</label>
          <div className="border rounded overflow-hidden dark:border-gray-600">
            {editor && <MenuBar editor={editor} />}
            <EditorContent 
              editor={editor} 
              className="prose dark:prose-invert max-w-none p-4 min-h-64 focus:outline-none" 
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </button>
          <Link
            href={`/posts/${postId}`}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}