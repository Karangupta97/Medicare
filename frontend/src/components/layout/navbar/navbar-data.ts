import type { IconName } from "./icons";

/** Placeholder user. TODO: wire auth later (replaces the old useAuthStore / usePatientStore data). */
export interface NavbarUser {
  name: string;
  avatarUrl: string | null;
  notificationCount: number;
  /** Shown under the name in the avatar menu (the old navbar showed it). */
  email?: string;
}

export interface NavLinkItem {
  href: string;
  label: string;
}

export interface MenuLinkItem extends NavLinkItem {
  icon: IconName;
  /** Renders the unread-count pill after the label (the Notifications item). */
  showCount?: boolean;
}

export interface BottomNavItem extends NavLinkItem {
  icon: IconName;
}

/** Desktop links, same order as the old navbar. */
export const DESKTOP_LINKS: readonly NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/health-records", label: "Health Records" },
  { href: "/dashboard/upload", label: "Upload Reports" },
  { href: "/aboutus", label: "About Us" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

/** Slide-in menu links (old file: Services and Profile are only here). */
export const DRAWER_LINKS: readonly NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/health-records", label: "Health Records" },
  { href: "/dashboard/upload", label: "Upload Reports" },
  { href: "/aboutus", label: "About Us" },
  { href: "/pricing", label: "Pricing" },
  { href: "/profile", label: "Profile" },
];

/** Avatar menu on mobile (<lg). */
export const MOBILE_USER_MENU: readonly MenuLinkItem[] = [
  { href: "/profile", label: "Profile", icon: "user" },
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/settings", label: "Settings", icon: "settings" },
  { href: "/notifications", label: "Notifications", icon: "bell", showCount: true },
];

/** Avatar menu on desktop (lg+). */
export const DESKTOP_USER_MENU: readonly MenuLinkItem[] = [
  { href: "/dashboard/profile", label: "Profile", icon: "user" },
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "bell", showCount: true },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

/** Bottom bar. The Upload item is the raised center button and is rendered separately. */
export const BOTTOM_NAV_BEFORE_UPLOAD: readonly BottomNavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/health-records", label: "Records", icon: "file-text" },
];
export const BOTTOM_NAV_UPLOAD: BottomNavItem = {
  href: "/dashboard/upload",
  label: "Upload",
  icon: "plus",
};
export const BOTTOM_NAV_AFTER_UPLOAD: readonly BottomNavItem[] = [
  { href: "/aboutus", label: "About", icon: "info" },
  { href: "/dashboard", label: "Dashboard", icon: "layout" },
];

/** Same rule as the old isActive: "/" matches exactly, everything else by prefix. */
export function isActivePath(pathname: string, path: string): boolean {
  if (path === "/") return pathname === "/";
  return pathname.startsWith(path);
}
