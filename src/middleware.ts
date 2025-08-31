import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is not authenticated, redirect to sign in
    if (!token && pathname !== "/" && !pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // If user is authenticated but accessing root, redirect to appropriate dashboard
    if (token && pathname === "/") {
      const dashboardUrl = token.role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }

    // Role-based redirects
    if (token) {
      const isAdmin = token.role === "ADMIN";
      
      // If admin tries to access student dashboard, redirect to admin dashboard
      if (isAdmin && pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      
      // If student tries to access admin dashboard, redirect to student dashboard
      if (!isAdmin && pathname === "/admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to auth pages without token
        if (pathname.startsWith("/auth") || pathname === "/") {
          return true;
        }
        
        // Require token for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
