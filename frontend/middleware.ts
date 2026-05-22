import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  
  // Si está en ruta pública y tiene token, redirigir al dashboard
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // Si está en ruta protegida y no tiene token, redirigir al login
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (!isPublicRoute && !token && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo).*)"],
};
