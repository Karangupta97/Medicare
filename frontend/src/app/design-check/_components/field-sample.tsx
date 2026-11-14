"use client";
// One form-label + form-input sample. It is a client component only for useId, so every copy
// (compare mode renders each sample twice) gets unique ids for label and error message.
import { useId } from "react";
import { XCircleIcon } from "./icons";

export type FieldState = "default" | "focus" | "error" | "disabled";

export function FieldSample({ state }: { state: FieldState }) {
  const id = useId();
  const errorId = `${id}-error`;
  const isError = state === "error";
  return (
    <div>
      <label htmlFor={id} className="form-label">
        Email address
      </label>
      <input
        id={id}
        type="email"
        defaultValue={isError ? "name@" : ""}
        placeholder="name@example.com"
        disabled={state === "disabled"}
        aria-invalid={isError || undefined}
        aria-describedby={isError ? errorId : undefined}
        className={`form-input ${state === "focus" ? "border-brand! ring-2! ring-brand!" : ""} ${isError ? "border-danger!" : ""}`}
      />
      {isError && (
        <p id={errorId} className="mt-1 flex items-center gap-1.5 text-sm text-danger">
          <XCircleIcon />
          Enter a complete email address.
        </p>
      )}
    </div>
  );
}
