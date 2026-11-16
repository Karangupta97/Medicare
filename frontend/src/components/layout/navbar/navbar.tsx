"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import lightLogo from "@/assets/logo/medicare-logo-full-on-light.svg";
import darkLogo from "@/assets/logo/medicare-logo-tp-full-on-dark.webp";
import { Icon } from "./icons";
import { LogoutModal } from "./logout-modal";
import { ProfilePicture } from "./profile-picture";
import {
  BOTTOM_NAV_AFTER_UPLOAD,
  BOTTOM_NAV_BEFORE_UPLOAD,
  BOTTOM_NAV_UPLOAD,
  DESKTOP_LINKS,
  DESKTOP_USER_MENU,
  DRAWER_LINKS,
  MOBILE_USER_MENU,
  isActivePath,
  type BottomNavItem,
  type MenuLinkItem,
  type NavbarUser,
} from "./navbar-data";

interface NavbarProps {
  /** TODO: wire auth later. null renders the logged-out Login button. */
  user: NavbarUser | null;
}

const MOBILE_MENU_ID = "user-menu-mobile";
const DESKTOP_MENU_ID = "user-menu-desktop";
const DRAWER_ID = "mobile-nav-drawer";

const HIDDEN_DROPDOWN = "opacity-0 translate-y-2.5 invisible pointer-events-none";
const SHOWN_DROPDOWN = "opacity-100 translate-y-0 visible";

function Logo({ className }: { className: string }) {
  // Light and dark variants swap with the theme through the logo-for-* utilities in globals.css.
  return (
    <>
      <Image className={`${className} logo-for-light`} src={lightLogo} alt="Medicare" priority />
      <Image className={`${className} logo-for-dark`} src={darkLogo} alt="" aria-hidden="true" priority />
    </>
  );
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  // Menus are open for one pathname only, so they close on route change without an effect.
  const [userMenuPath, setUserMenuPath] = useState<string | null>(null);
  const [drawerPath, setDrawerPath] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const desktopTriggerRef = useRef<HTMLButtonElement>(null);

  const isUserMenuOpen = userMenuPath === pathname;
  // The old file has no control that opens this slide-in menu (setIsMenuOpen(true) is never called),
  // so it can never be opened here either. It is ported as is.
  const isMenuOpen = drawerPath === pathname;

  const closeUserMenu = useCallback(() => setUserMenuPath(null), []);
  const closeLogoutModal = useCallback(() => setIsLogoutModalOpen(false), []);
  const toggleUserMenu = () => setUserMenuPath(isUserMenuOpen ? null : pathname);

  // Close the avatar menu on outside click; Escape closes the menus and returns focus to the button.
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("[data-user-menu]")) {
        setUserMenuPath(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDrawerPath(null);
      setUserMenuPath((open) => {
        if (open !== null) {
          const visible = [mobileTriggerRef.current, desktopTriggerRef.current].find(
            (button) => button !== null && button.offsetParent !== null,
          );
          visible?.focus();
        }
        return null;
      });
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleLogoutClick = () => {
    setUserMenuPath(null);
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    // TODO: wire auth later (old: await logout(), onLogout(), window.location.reload()).
    router.push("/");
  };

  const isActive = (path: string) => isActivePath(pathname, path);
  const current = (path: string) => (isActive(path) ? ("page" as const) : undefined);

  const renderMenuLink = (item: MenuLinkItem) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={current(item.href)}
      className="menu-item"
      onClick={closeUserMenu}
    >
      <Icon name={item.icon} className="w-4 h-4 text-text-muted" />
      <span>{item.label}</span>
      {item.showCount === true && user !== null && user.notificationCount > 0 && (
        <span className="ml-auto bg-danger-subtle text-danger text-xs px-1.5 py-0.5 rounded-full font-medium">
          {user.notificationCount}
        </span>
      )}
    </Link>
  );

  const renderLogoutButton = () => (
    <button
      type="button"
      onClick={handleLogoutClick}
      className="menu-item w-full text-left text-danger hover:bg-danger-subtle"
    >
      <Icon name="log-out" className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );

  const renderUserHeader = (u: NavbarUser) => (
    <div className="px-4 py-2 border-b border-border">
      <p className="text-sm font-medium text-text">{u.name || "User"}</p>
      <p className="text-xs text-text-muted">{u.email ?? ""}</p>
    </div>
  );

  const renderBottomItem = (item: BottomNavItem) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={current(item.href)}
        className={`flex flex-col items-center justify-center w-1/5 h-full relative group transition-all duration-300 ${
          active ? "text-brand" : "text-text-muted hover:text-brand"
        }`}
      >
        {active && <div className="absolute -top-px w-12 h-1 bg-brand rounded-full" />}
        <div className="relative">
          <Icon
            name={item.icon}
            className={`w-6 h-6 mb-1.5 transition-transform duration-300 group-hover:scale-110 ${active ? "scale-110" : ""}`}
          />
          {active && <div className="absolute inset-0 bg-brand/10 rounded-full blur-lg -z-10"></div>}
        </div>
        <span
          className={`text-xs font-medium transition-all duration-300 ${
            active ? "opacity-100 transform translate-y-0" : "opacity-70 group-hover:opacity-100"
          }`}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  const uploadActive = isActive(BOTTOM_NAV_UPLOAD.href);

  return (
    <>
      <div className="flex justify-center w-full bg-surface">
        <div className="w-full min-h-(--navbar-h) max-w-[1700px] flex justify-between items-center py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 relative z-40">
          <LogoutModal isOpen={isLogoutModalOpen} onClose={closeLogoutModal} onConfirm={handleLogoutConfirm} />

          {/* Mobile Controls */}
          <div className="flex justify-between items-center w-full lg:hidden">
            <Link href="/" className="flex items-center min-h-11">
              <Logo className="w-20 sm:w-24 md:w-32 h-auto" />
            </Link>

            <div className="flex items-center space-x-1.5 sm:space-x-3">
              {user !== null ? (
                <div className="relative" data-user-menu>
                  <button
                    ref={mobileTriggerRef}
                    type="button"
                    onClick={toggleUserMenu}
                    aria-label="Account menu"
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                    aria-controls={MOBILE_MENU_ID}
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                  >
                    <span className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border-2 border-brand">
                      <ProfilePicture user={user} className="w-8 h-8 rounded-full object-cover" />
                    </span>
                  </button>

                  {/* Mobile Profile Dropdown Menu */}
                  <div
                    id={MOBILE_MENU_ID}
                    className={`absolute right-0 top-12 mt-2 w-48 bg-surface rounded-xl shadow-xl py-2 border border-border z-50 transition-all duration-200 motion-reduce:transition-none ${
                      isUserMenuOpen ? `${SHOWN_DROPDOWN} scale-100` : `${HIDDEN_DROPDOWN} scale-95`
                    }`}
                  >
                    {renderUserHeader(user)}
                    {MOBILE_USER_MENU.map(renderMenuLink)}
                    {renderLogoutButton()}
                  </div>
                </div>
              ) : (
                // TODO: wire auth later (login and signup routes)
                <>
                  <Link href="/login" className="btn btn-primary rounded-full px-3 sm:px-4 hover:shadow-lg">
                    Login
                  </Link>
                  <Link href="/signup" className="btn btn-secondary rounded-full px-3 sm:px-4">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between w-full">
            <Link href="/" className="flex items-center min-h-11 shrink-0">
              <Logo className="w-32 lg:w-36 xl:w-40 h-auto" />
            </Link>

            <nav
              aria-label="Main"
              className="flex space-x-0 xl:space-x-6 text-sm xl:text-base font-sans font-bold"
            >
              {DESKTOP_LINKS.map((item) => (
                <Link key={item.href} href={item.href} aria-current={current(item.href)} className="nav-link whitespace-nowrap px-3 xl:px-4">
                  {item.label}
                </Link>
              ))}
            </nav>

            {user !== null ? (
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <Link
                  href="/dashboard/notifications"
                  aria-label={
                    user.notificationCount > 0
                      ? `Notifications, ${user.notificationCount} unread`
                      : "Notifications"
                  }
                  className="relative p-2 min-w-11 min-h-11 flex items-center justify-center hover:bg-surface-muted rounded-xl"
                >
                  <Icon name="bell" className="w-6 h-6 text-text-muted" />
                  {user.notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-danger flex items-center justify-center text-on-brand text-xs font-bold">
                      {user.notificationCount > 9 ? "9+" : user.notificationCount}
                    </span>
                  )}
                </Link>

                <div className="relative" data-user-menu>
                  <button
                    ref={desktopTriggerRef}
                    type="button"
                    onClick={toggleUserMenu}
                    aria-label="Account menu"
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                    aria-controls={DESKTOP_MENU_ID}
                    className="flex items-center space-x-3 p-1.5 hover:bg-surface-muted rounded-xl group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-brand to-secondary">
                      <ProfilePicture user={user} />
                    </div>
                    <Icon name="chevron-down" className="w-4 h-4 text-text-muted group-hover:text-text" />
                  </button>

                  <div
                    id={DESKTOP_MENU_ID}
                    className={`absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg py-2 border border-border z-50 transition-all duration-200 motion-reduce:transition-none ${
                      isUserMenuOpen ? SHOWN_DROPDOWN : HIDDEN_DROPDOWN
                    }`}
                  >
                    {renderUserHeader(user)}
                    {DESKTOP_USER_MENU.map(renderMenuLink)}
                    {renderLogoutButton()}
                  </div>
                </div>
              </div>
            ) : (
              // TODO: wire auth later (login and signup routes)
              <div className="flex items-center space-x-2">
                <Link href="/login" className="btn btn-primary rounded-full whitespace-nowrap px-5 py-2 text-base hover:shadow-lg">
                  Login
                </Link>
                <Link href="/signup" className="btn btn-secondary rounded-full whitespace-nowrap px-5 py-2 text-base">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Menu (slide-in) */}
          <div
            className={`fixed inset-0 bg-overlay/50 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 motion-reduce:transition-none ${
              isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            }`}
            onClick={() => setDrawerPath(null)}
          >
            <div
              id={DRAWER_ID}
              className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-surface shadow-xl transition-transform duration-300 motion-reduce:transition-none ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <Logo className="w-32 h-auto" />
                <button
                  type="button"
                  onClick={() => setDrawerPath(null)}
                  aria-label="Close menu"
                  className="p-2 min-w-11 min-h-11 flex items-center justify-center hover:bg-surface-muted rounded-full"
                >
                  <Icon name="x" className="w-6 h-6 text-brand" />
                </button>
              </div>

              <nav aria-label="Menu" className="p-4 space-y-2">
                {DRAWER_LINKS.map((item) => (
                  <Link key={item.href} href={item.href} aria-current={current(item.href)} className="mobile-nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile and Medium Devices */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_color-mix(in_srgb,var(--sem-text)_5%,transparent)] z-50">
        <div className="max-w-md mx-auto px-2 sm:px-4 pb-[env(safe-area-inset-bottom)]">
          <nav aria-label="Bottom" className="flex justify-between items-center h-[60px] sm:h-[65px] relative">
            {BOTTOM_NAV_BEFORE_UPLOAD.map(renderBottomItem)}

            {/* Upload Button - Enhanced */}
            <Link
              href={BOTTOM_NAV_UPLOAD.href}
              aria-current={current(BOTTOM_NAV_UPLOAD.href)}
              className="relative flex flex-col items-center -mt-8 group"
            >
              <div
                className={`w-16 h-16 rounded-full ${
                  uploadActive ? "bg-brand" : "bg-brand-hover"
                } flex items-center justify-center shadow-lg border-4 border-surface/80 backdrop-blur-lg transition-all duration-300 hover:shadow-xl group-hover:scale-105 group-hover:border-surface`}
              >
                <Icon
                  name="plus"
                  className="w-7 h-7 text-on-brand transition-transform duration-300 group-hover:rotate-180"
                />
                <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span
                className={`text-xs font-medium mt-1 transition-all duration-300 ${
                  uploadActive ? "text-brand opacity-100" : "text-text-muted group-hover:text-brand"
                }`}
              >
                {BOTTOM_NAV_UPLOAD.label}
              </span>
            </Link>

            {BOTTOM_NAV_AFTER_UPLOAD.map(renderBottomItem)}
          </nav>
        </div>

        {/* Enhanced glass effect */}
        <div className="absolute inset-0 bg-linear-to-b from-surface/60 to-surface/95 backdrop-blur-xl -z-10"></div>
      </div>
    </>
  );
}
