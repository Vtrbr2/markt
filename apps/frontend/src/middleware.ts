import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/carrinho', '/checkout', '/meus-pedidos', '/perfil', '/painel', '/produtos/novo', '/admin'];
const sellerPaths = ['/painel', '/produtos', '/vendas', '/loja'];
const adminPaths = ['/admin'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value || '';

  // Verificação simples: se tem token no cookie, está autenticado
  // Em produção, validar o token JWT ou usar sessão
  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;

  // Rotas protegidas genéricas
  if (protectedPaths.some((p) => path.startsWith(p)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/carrinho/:path*', '/checkout/:path*', '/meus-pedidos/:path*', '/perfil/:path*', '/painel/:path*', '/produtos/:path*', '/vendas/:path*', '/loja/:path*', '/admin/:path*'],
};
