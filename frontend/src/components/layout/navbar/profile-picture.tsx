"use client";

import { useState } from "react";
import Image from "next/image";
import type { NavbarUser } from "./navbar-data";

interface ProfilePictureProps {
  user: NavbarUser;
  /** Overrides the default full-size classes, like the old className prop. */
  className?: string;
}

/**
 * Avatar image, with the old initial-on-gradient fallback when there is no photo or it fails to load.
 * TODO: wire auth later (old version cache-busted photoURL with Date.now() and used a user.png default).
 */
export function ProfilePicture({ user, className }: ProfilePictureProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = user.avatarUrl !== null && user.avatarUrl !== failedUrl;

  if (!showImage) {
    return (
      <div
        className={`${className ?? "w-full h-full"} rounded-full bg-linear-to-br from-brand to-secondary flex items-center justify-center text-on-brand font-bold text-lg`}
      >
        {user.name.charAt(0) || "U"}
      </div>
    );
  }

  return (
    // unoptimized: the avatar host is not known yet (TODO: wire auth later), so no remotePatterns entry exists.
    <Image
      src={user.avatarUrl ?? ""}
      alt="User"
      width={40}
      height={40}
      unoptimized
      className={className ?? "w-full h-full object-cover"}
      onError={() => setFailedUrl(user.avatarUrl)}
    />
  );
}
