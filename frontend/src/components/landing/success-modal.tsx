"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { LandingIcon } from "./landing-icons";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  redirectTo?: string;
}

// Old version also fired canvas-confetti from both bottom corners. canvas-confetti is not installed, so that is left out.
export function SuccessModal({ isOpen, onClose, message, redirectTo = "/" }: SuccessModalProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    linkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-overlay/50 p-4 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
        isOpen ? "opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        className={`relative w-full max-w-md overflow-hidden rounded-2xl bg-surface p-6 text-center transition-transform duration-300 ease-out motion-reduce:transition-none sm:p-8 ${
          isOpen ? "scale-100" : "scale-90"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-br from-success-subtle to-secondary-subtle" />
        <div className="relative z-10">
          <LandingIcon name="check-circle" className="mx-auto mb-6 size-16 text-success" />
          <h2 id="success-modal-title" className="mb-4 text-2xl font-bold text-text">
            Thank You for Sharing!
          </h2>
          <p className="mb-6 text-base text-text-muted">
            {message ??
              "Your voice matters! We're grateful for your valuable feedback and for helping us improve healthcare experiences for everyone."}
          </p>
          <Link ref={linkRef} href={redirectTo} className="btn btn-primary mx-auto w-fit px-6 py-3">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
