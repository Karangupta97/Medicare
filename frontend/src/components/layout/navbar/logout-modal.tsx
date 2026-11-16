"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./icons";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Escape closes the modal; focus moves to Cancel when it opens.
  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 motion-reduce:transition-none ${
        isOpen ? "opacity-100" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-overlay/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        className={`relative w-full max-w-sm bg-surface rounded-2xl shadow-xl p-6 sm:p-8 transition-transform duration-200 motion-reduce:transition-none ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-6 rounded-full bg-danger-subtle flex items-center justify-center">
          <Icon name="alert-triangle" className="w-6 h-6 sm:w-7 sm:h-7 text-danger" />
        </div>
        {/* Content */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 id="logout-modal-title" className="text-lg sm:text-xl font-semibold text-text mb-2">
            Confirm Logout
          </h2>
          <p className="text-sm sm:text-base text-text-muted">
            Are you sure you want to logout? You will need to login again to access your account.
          </p>
        </div>
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-primary flex-1 order-1 sm:order-2 bg-danger! hover:bg-danger/90!"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
