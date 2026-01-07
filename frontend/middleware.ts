import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証不要なパス
const publicPaths = ['/login'];

// 静的アセットのパス（ミドルウェアをスキップ）
const staticPaths = ['/_next', '/favicon.ico', '/images', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静的アセットはスキップ
  if (staticPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // クッキーまたはヘッダーからトークンを取得
  // Note: localStorageはサーバーサイドでアクセスできないため、
  // クライアントサイドでの認証チェックも併用する
  const token = request.cookies.get('access_token')?.value;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 未認証で保護されたページにアクセスした場合
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 認証済みでログインページにアクセスした場合
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
