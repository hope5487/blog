export async function POST(req) {
    const body = await req.json();
    const { username, password } = body;
  
    // 간단한 예제 로직
    if (username === 'id' && password === '1234') {
      return new Response(JSON.stringify({ success: true, message: '로그인 성공' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: '아이디 또는 비밀번호 오류' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
}