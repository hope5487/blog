"use client";

import React, { useState } from 'react';

export default function MenuBar({ editor }) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event) => {
      if (input.files?.length) {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            editor.chain().focus().setImage({ src: result }).run();
          }
        };
        
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const setLink = () => {
    // 검증된 URL인지 확인
    let url = linkUrl;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    // 링크 설정하고 입력 폼 닫기
    editor.chain().focus().setLink({ href: url }).run();
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const addYoutubeVideo = () => {
    // 유튜브 URL에서 ID 추출
    const url = youtubeUrl;
    const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regex);
    
    if (match && match[2].length === 11) {
      editor.chain().focus().setYoutubeVideo({ src: match[2] }).run();
    } else {
      alert('유효한 YouTube URL을 입력해주세요.');
    }
    
    setShowYoutubeInput(false);
    setYoutubeUrl('');
  };

  return (
    <div className="border-b bg-gray-50">
      <div className="p-1 flex flex-wrap gap-1 items-center">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="굵게"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.613A4.5 4.5 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8Z" />
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="기울임"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2Z" />
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
          title="취소선"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846Zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699Z" />
          </svg>
        </button>
        
        <div className="border-r mx-1 h-6"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          title="제목 1"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16Zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21Z" />
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="제목 2"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2Zm14.5 4a3.5 3.5 0 0 1 2.5 1.033l-1.376 1.528A1.777 1.777 0 0 0 18.5 10c-.949 0-1.35.446-1.35 1.004 0 .73.655 1.34 1.85 1.34h.5v1.634H19c-1.5 0-2 .303-2 1.23 0 .8.502 1.338 1.645 1.338.456 0 .905-.145 1.349-.435l1.006 1.634A3.835 3.835 0 0 1 18.5 18.5c-2.023 0-3.583-1.258-3.583-3.279 0-1.09.615-1.999 1.578-2.474-.704-.483-1.155-1.347-1.155-2.227C15.34 8.878 16.717 8 18.5 8Z" />
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
          title="제목 3"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M22 8l-.002 2-2.505 2.883c1.59.435 2.757 1.89 2.757 3.617 0 2.071-1.65 3.5-3.75 3.5-1.65 0-2.89-.525-3.855-1.57l1.08-1.54c.787.779 1.605 1.11 2.655 1.11 1.2 0 2.12-.727 2.12-1.92 0-1.23-.84-1.93-2.12-1.93h-1.2v-2h1.19c1.09 0 1.94-.75 1.94-1.81 0-1.08-.73-1.69-1.79-1.69-.92 0-1.52.39-2.13 1.13l-1.06-1.34C15.22 8.34 16.31 8 17.63 8c1.92 0 3.42 1.06 3.42 2.94 0 1.3-.75 2.26-1.92 2.75L22 8ZM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2Z" />
          </svg>
        </button>
        
        <div className="border-r mx-1 h-6"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="글머리 기호"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M8 4h13v2H8V4ZM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM8 11h13v2H8v-2Zm0 7h13v2H8v-2Z" />
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="번호 매기기"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M8 4h13v2H8V4ZM5 3v3h1v1H3V6h1V4H3V3h2Zm-2 7h3.25v1.5H5V14h1v1H3v-1h1v-1.5H3v-1.5h1V10H3V8.5h3.25V10H5v1Zm2 7v2H3v-3h2v1Zm0 0v-1h1v1H5Zm3 0h13v2H8v-2Zm0-7h13v2H8v-2Z" />
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="인용"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M4.58 3.58a9.99 9.99 0 0 1 11.32 1.52 9.984 9.984 0 0 1 2.93 7.07c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-7.73-3.68l-6.26 2.9A2.001 2.001 0 0 1-7 20.4v-8.77a10 10 0 0 1 11.58-8.05zm1.43 1.93a8 8 0 0 0-4.02 5.14l-.29 1.35H-3v4.08l4.61-2.14.71.71a8 8 0 1 0 3.69-9.14z" fillRule="evenodd"/>
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
          title="코드 블록"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M16.95 8.464l1.414-1.414 4.95 4.95-4.95 4.95-1.414-1.414L20.485 12l-3.536-3.536Zm-9.9 0L3.515 12l3.535 3.536-1.414 1.414L.686 12l4.95-4.95L7.05 8.464Z" />
          </svg>
        </button>
        
        <div className="border-r mx-1 h-6"></div>
        
        {/* 이미지 추가 버튼 */}
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-100"
          title="이미지 삽입"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
            <path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
          </svg>
        </button>
        
        {/* 링크 추가 버튼과 입력 폼 */}
        <div className="relative">
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
            title="링크 삽입"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
              <path d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z" />
            </svg>
          </button>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white shadow-lg rounded z-10 flex">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="URL 입력"
                className="border rounded p-1 w-64"
              />
              <button
                onClick={setLink}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                type="button"
              >
                확인
              </button>
            </div>
          )}
        </div>
        
        {/* 유튜브 비디오 추가 버튼과 입력 폼 */}
        <div className="relative">
          <button
            onClick={() => setShowYoutubeInput(!showYoutubeInput)}
            className="p-2 rounded hover:bg-gray-100"
            title="YouTube 영상 삽입"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
              <path d="M12.244 4c.534.003 1.87.016 3.29.073l.504.022c1.429.067 2.857.183 3.566.38.945.266 1.687 1.04 1.938 2.022.4 1.56.45 4.602.456 5.339L22 12c0 .168-.004 1.12-.062 2.268-.03.58-.08 1.198-.157 1.78-.078.583-.188 1.097-.338 1.515-.256 1.04-1 1.808-1.938 2.062-.715.187-2.143.312-3.582.389l-.505.026c-1.442.065-2.881.085-3.417.09L12 20l-.162-.001c-.534-.005-1.87-.026-3.29-.089l-.504-.026c-1.439-.077-2.867-.202-3.582-.39-.937-.253-1.682-1.022-1.938-2.06-.15-.42-.26-.934-.338-1.517-.077-.582-.127-1.2-.157-1.78C2.004 13.12 2 12.167 2 12c0-.168.004-1.12.062-2.268.03-.58.08-1.198.157-1.78.078-.583.188-1.097.338-1.515.256-1.04 1-1.808 1.938-2.062.715-.187 2.143-.312 3.582-.389l.505-.026c1.413-.063 2.746-.076 3.28-.079L12 4h.244ZM10 9v6l5.25-3L10 9Z" />
            </svg>
          </button>
          {showYoutubeInput && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white shadow-lg rounded z-10 flex">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="YouTube URL 입력"
                className="border rounded p-1 w-64"
              />
              <button
                onClick={addYoutubeVideo}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                type="button"
              >
                확인
              </button>
            </div>
          )}
        </div>
        
        <div className="ml-auto">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="되돌리기"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
              <path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z"/>
            </svg>
          </button>
          
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="다시 실행"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
              <path d="M16.172 11H4v2h12.172l-5.364 5.364 1.414 1.414L20 12l-7.778-7.778-1.414 1.414z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}