import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {updateSession} from "@/lib/supbaseMiddleware"


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = await req.cookies.get('supabase_token') 

  if(!accessToken && pathname !== '/login') {
    return NextResponse.rewrite(new URL('/login', req.url));
  }

  await updateSession(req)

  if (pathname === '/login') {
    if(accessToken?.value){
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};