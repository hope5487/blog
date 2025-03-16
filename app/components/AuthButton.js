"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from 'next/image';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return <div className="text-sm">로딩 중...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user.image && (
            <Image 
              src={session.user.image} 
              alt="Profile" 
              width={32}
              height={32}
              className="rounded-full"
              unoptimized
            />
          )}
          <span>{session.user.name}</span>
        </div>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => signOut()}
        >
          로그아웃
        </button>
        {session.user.isAdmin && (
          <Link 
            href="/posts/create" 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            새 글 작성
          </Link>
        )}
      </div>
    );
  }

  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={() => signIn("github")}
    >
      GitHub로 로그인
    </button>
  );
}