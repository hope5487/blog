import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";

// NextAuth 핸들러 생성
const handler = NextAuth(authOptions);

// GET 및 POST 메서드 내보내기
export { handler as GET, handler as POST };