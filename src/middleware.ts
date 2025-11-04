import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { USER_ROLES, ROUTES, COOKIE_NAMES, isRoleInList } from "@/constants";

interface Decoded {
  sub: string;
  email: string;
  name?: string;
  "custom:role"?: string;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const idToken = req.cookies.get(COOKIE_NAMES.ID_TOKEN)?.value;
  const accessToken = req.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const role = req.cookies.get(COOKIE_NAMES.ROLE)?.value;
  const path = url.pathname;

  if (path.startsWith("/admin")) {
    if (!idToken && !accessToken) {
      url.pathname = ROUTES.LOGIN;
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
      if (userRole !== USER_ROLES.ADMIN) {
        if (userRole) {
          // User đã đăng nhập nhưng không phải ADMIN
          url.pathname = ROUTES.HOME;
          return NextResponse.redirect(url);
        } else {
          // Không có role, redirect về login
          url.pathname = ROUTES.LOGIN;
          url.searchParams.set("redirect", path);
          return NextResponse.redirect(url);
        }
      }
    } catch (e) {
      console.error("Decode token error for admin route:", e);
      // Token không hợp lệ, redirect về login
      url.pathname = ROUTES.LOGIN;
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
      isRoleInList(userRole, [USER_ROLES.DONOR, USER_ROLES.FUNDRAISER]) &&
      (path.startsWith(ROUTES.ADMIN) ||
        path.startsWith(ROUTES.KITCHEN) ||
        path.startsWith(ROUTES.DELIVERY))
    ) {
      url.pathname = ROUTES.HOME;
      return NextResponse.redirect(url);
    }

    // Kitchen: chỉ cho /kitchen + public
    if (userRole === USER_ROLES.KITCHEN && path.startsWith(ROUTES.ADMIN)) {
      url.pathname = ROUTES.KITCHEN;
      return NextResponse.redirect(url);
    }
    if (userRole === USER_ROLES.KITCHEN && path.startsWith(ROUTES.DELIVERY)) {
      url.pathname = ROUTES.KITCHEN;
      return NextResponse.redirect(url);
    }

    // Delivery: chỉ cho /delivery + public
    if (userRole === USER_ROLES.DELIVERY && path.startsWith(ROUTES.ADMIN)) {
      url.pathname = ROUTES.DELIVERY;
      return NextResponse.redirect(url);
    }
    if (userRole === USER_ROLES.DELIVERY && path.startsWith(ROUTES.KITCHEN)) {
      url.pathname = ROUTES.DELIVERY;
      return NextResponse.redirect(url);
    }

    // Admin: chỉ cho /admin + public
    if (userRole === USER_ROLES.ADMIN && path.startsWith(ROUTES.KITCHEN)) {
      url.pathname = ROUTES.ADMIN;
      return NextResponse.redirect(url);
    }
    if (userRole === USER_ROLES.ADMIN && path.startsWith(ROUTES.DELIVERY)) {
      url.pathname = ROUTES.ADMIN;
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
