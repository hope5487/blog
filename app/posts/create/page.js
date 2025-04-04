"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Youtube from '@tiptap/extension-youtube';
import MenuBar from '../../components/MenuBar';

export default function CreatePost() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('dev'); // 기본 카테고리
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        content: '',
        autofocus: 'end',
    });

    // 로딩 중
    if (status === 'loading') {
        return <p className="text-center p-10">로딩 중...</p>;
    }

    // 관리자가 아니면 접근 불가
    if (!session || !session.user.isAdmin) {
        return (
        <div className="container mx-auto my-10 p-5 text-center">
            <h1 className="text-xl font-bold">접근 권한이 없습니다.</h1>
            <p>관리자만 글을 작성할 수 있습니다.</p>
            <Link
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            홈으로 돌아가기
            </Link>
        </div>
        );
    }

    // 포스트 생성 함수
    const createPost = async (e) => {
        e.preventDefault();
        if (!editor) return;
        
        setIsSubmitting(true);
        const content = editor.getHTML();
    
        try {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, category }),
        });
        
        if (res.ok) {
            router.push('/');
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
        console.error('Error creating post:', error);
        alert(`글 작성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-10 p-5">
        <h1 className="text-2xl font-bold mb-5">새 글 작성</h1>
        <form onSubmit={createPost} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
            <label className="block mb-2 font-medium">제목</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
            />
            </div>
            
            <div className="mb-4">
            <label className="block mb-2 font-medium">카테고리</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
            >
                <option value="dev">개발</option>
                <option value="tech">기술</option>
                <option value="life">일상</option>
            </select>
            </div>
            
            <div className="mb-6">
            <label className="block mb-2 font-medium">내용</label>
            <div className="border rounded overflow-hidden">
                {editor && <MenuBar editor={editor} />}
                <EditorContent 
                editor={editor} 
                className="prose max-w-none p-4 min-h-64 focus:outline-none" 
                />
            </div>
            </div>
            
            <div className="flex gap-4">
            <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                disabled={isSubmitting}
            >
                {isSubmitting ? '작성 중...' : '작성하기'}
            </button>
            <Link
                href="/"
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
                취소
            </Link>
            </div>
        </form>
        </div>
    );
    }