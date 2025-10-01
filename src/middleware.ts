import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface Decoded {
  sub: string;
  email: string;
  name?: string;
  "custom:role"?: string;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const idToken = req.cookies.get("idToken")?.value;
  const accessToken = req.cookies.get("accessToken")?.value;
  const role = req.cookies.get("role")?.value;
  const path = url.pathname;

  if (path.startsWith("/admin")) {
    if (!idToken && !accessToken) {
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    try {
      let userRole = role?.toUpperCase();

      if (!userRole && (idToken || accessToken)) {
        const tokenToDecode = idToken || accessToken;
        const decoded = jwtDecode<Decoded>(tokenToDecode!);
        userRole = decoded["custom:role"]?.toUpperCase();
      }

      // Chỉ cho phép ADMIN truy cập /admin
      if (userRole !== "ADMIN") {
        if (userRole) {
          // User đã đăng nhập nhưng không phải ADMIN
          url.pathname = "/";
          return NextResponse.redirect(url);
        } else {
          // Không có role, redirect về login
          url.pathname = "/login";
          url.searchParams.set("redirect", path);
          return NextResponse.redirect(url);
        }
      }
    } catch (e) {
      console.error("Decode token error for admin route:", e);
      // Token không hợp lệ, redirect về login
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
  }

  // Nếu không có token và role, cho phép truy cập các route public
  if (!idToken && !accessToken && !role) {
    return NextResponse.next();
  }

  try {
    let userRole = role?.toUpperCase();
    if (!userRole && (idToken || accessToken)) {
      const tokenToDecode = idToken || accessToken;
      const decoded = jwtDecode<Decoded>(tokenToDecode!);
      userRole = decoded["custom:role"]?.toUpperCase();
    }

    if (!userRole) return NextResponse.next();

    // Donor/Fundraiser: không được vào /admin, /kitchen, /delivery
    if (
      ["DONOR", "FUNDRAISER"].includes(userRole) &&
      (path.startsWith("/admin") ||
        path.startsWith("/kitchen") ||
        path.startsWith("/delivery"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Kitchen: chỉ cho /kitchen + public
    if (userRole === "KITCHEN" && path.startsWith("/admin")) {
      url.pathname = "/kitchen";
      return NextResponse.redirect(url);
    }
    if (userRole === "KITCHEN" && path.startsWith("/delivery")) {
      url.pathname = "/kitchen";
      return NextResponse.redirect(url);
    }

    // Delivery: chỉ cho /delivery + public
    if (userRole === "DELIVERY" && path.startsWith("/admin")) {
      url.pathname = "/delivery";
      return NextResponse.redirect(url);
    }
    if (userRole === "DELIVERY" && path.startsWith("/kitchen")) {
      url.pathname = "/delivery";
      return NextResponse.redirect(url);
    }

    // Admin: chỉ cho /admin + public
    if (userRole === "ADMIN" && path.startsWith("/kitchen")) {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    if (userRole === "ADMIN" && path.startsWith("/delivery")) {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  } catch (e) {
    console.error("Decode token error", e);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
