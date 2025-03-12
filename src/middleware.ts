import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = await req.cookies.get('supabase_token') 
  const refreshToken = await req.cookies.get('supabase_refresh_token') 

  if(!accessToken && pathname !== '/login') {
    return NextResponse.rewrite(new URL('/login', req.url));
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {

     const { data: { session : newSession  } } = await supabase.auth.setSession({
      access_token: accessToken?.value || '',
      refresh_token: refreshToken?.value || '',
    })
    
    if(newSession){
      if (pathname === '/login') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    else {
      if (pathname !== '/login') {
        return NextResponse.rewrite(new URL('/login', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};