"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { LandingIcon } from "./landing-icons";
import { ROLE_OPTIONS } from "./landing-data";
import { Reveal } from "./reveal";
import { SuccessModal } from "./success-modal";

interface ReviewFormData {
  name: string;
  role: string;
  review: string;
  rating: number;
  isAnonymous: boolean;
}

interface SubmitStatus {
  type: "" | "success" | "error";
  message: string;
}

// Old field style: px-4 py-3, rounded-xl, light border, half-transparent white. Text is 16px (old 14px) so iOS does not zoom on focus;
// the border uses border-strong so the control boundary meets 3:1.
const LABEL = "block text-sm font-medium text-text";
const FIELD =
  "w-full min-h-11 rounded-xl border border-border-strong bg-surface/50 px-4 py-3 text-base text-text placeholder:text-text-muted backdrop-blur-sm transition-all duration-200 ease-out focus:border-brand focus:ring-2 focus:ring-brand";

const EMPTY_FORM: ReviewFormData = { name: "", role: "patient", review: "", rating: 0, isAnonymous: false };

/**
 * TODO: wire API later. The old page did axios.post("/api/reviews/submit", { ...formData, reviewType: "normal" }).
 * This placeholder sends nothing and resolves with a message, so the form flow can be tested.
 */
async function submitReview(data: ReviewFormData): Promise<{ message: string }> {
  void data;
  return { message: "Thank you for sharing your experience!" };
}

function validate(form: ReviewFormData): string | null {
  if (!form.review) return "Please share your experience";
  if (form.review.length < 10) return "Your review must be at least 10 characters long";
  if (form.review.length > 1000) return "Your review must not exceed 1000 characters";
  if (!form.isAnonymous && !form.name) return "Please enter your name or select anonymous submission";
  if (!form.rating) return "Please provide a rating";
  return null;
}

export function ReviewForm() {
  const [formData, setFormData] = useState<ReviewFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: "", message: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });
    try {
      const problem = validate(formData);
      if (problem !== null) throw new Error(problem);
      const response = await submitReview(formData);
      setFormData(EMPTY_FORM);
      setShowSuccessModal(true);
      setSubmitStatus({ type: "success", message: response.message });
      // Old behavior: the modal hides itself after 3 seconds
      window.setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Old: a card (not a section) with mt-8 sm:mt-10 md:mt-12, max-w-3xl, no side margin, and pb-8 below.
    <section aria-labelledby="review-title" className="w-full pb-8">
        <Reveal className="mx-auto mt-8 max-w-3xl rounded-2xl border border-surface-muted bg-linear-to-br from-surface to-page p-6 shadow-lg sm:mt-10 sm:rounded-3xl sm:p-8 md:mt-12 md:p-10">
          <div className="mb-8 text-center">
            <h2 id="review-title" className="mb-3 text-xl font-bold text-brand sm:text-2xl">
              Share Your Experience
            </h2>
            <p className="text-sm text-text-muted sm:text-base">Help others by sharing your experience with Medicare</p>
            <Link
              href="/detail-review"
              className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-brand transition-colors duration-200 ease-out hover:text-brand-hover"
            >
              Are you a healthcare provider? Share your detailed experience →
            </Link>
          </div>

          {submitStatus.message !== "" && (
            <div
              role={submitStatus.type === "error" ? "alert" : "status"}
              className={`mb-6 rounded-xl border p-4 text-base ${
                submitStatus.type === "success"
                  ? "border-success/30 bg-success-subtle text-success"
                  : "border-danger/30 bg-danger-subtle text-danger"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className={LABEL}>
                  Your Name {!formData.isAnonymous && <span className="text-danger">*</span>}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={formData.isAnonymous}
                  className={`${FIELD} ${formData.isAnonymous ? "cursor-not-allowed opacity-50" : ""}`}
                  placeholder={formData.isAnonymous ? "Anonymous" : "Enter your name"}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className={LABEL}>
                  Your Role <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className={`${FIELD} cursor-pointer appearance-none bg-none pr-10`}
                  >
                    <option value="">Select your role</option>
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <LandingIcon name="chevron-down" className="size-4 text-text-muted" />
                  </div>
                </div>
              </div>
            </div>

            <fieldset className="space-y-2">
              <legend className={`${LABEL} mb-2`}>
                Your Rating <span className="text-danger">*</span>
              </legend>
              <div className="flex flex-wrap items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                    aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                    aria-pressed={formData.rating >= star}
                    className={`flex size-11 items-center justify-center rounded-lg transition-[transform,color] duration-200 ease-out ${
                      formData.rating >= star ? "scale-110 text-star" : "text-border-strong hover:text-star"
                    }`}
                  >
                    {/* Old: FiStar outline in both states; only the color changes */}
                    <LandingIcon name="star" className="size-8" />
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="mt-1 text-sm text-text-muted">
                  {formData.rating} {formData.rating === 1 ? "star" : "stars"}
                </p>
              )}
            </fieldset>

            <div className="space-y-2">
              <label htmlFor="review" className={LABEL}>
                Your Experience <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-muted">({formData.review.length}/1000 characters)</span>
              </label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                required
                maxLength={1000}
                rows={4}
                aria-describedby="review-hint"
                className={`${FIELD} resize-none`}
                placeholder="Share your experience with Medicare... (minimum 10 characters)"
              />
              <p id="review-hint" className="mt-1 text-xs text-danger empty:hidden">
                {formData.review.length < 10 && formData.review.length > 0 ? "Please write at least 10 characters" : ""}
              </p>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
              <label htmlFor="isAnonymous" className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-text-muted">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="size-4 rounded border-border-strong text-brand focus:ring-brand"
                />
                Submit anonymously
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 py-3 font-medium text-on-brand shadow-md transition-[transform,background-color,box-shadow] duration-200 ease-out hover:shadow-lg sm:w-auto ${
                  isSubmitting ? "cursor-not-allowed opacity-75" : "hover:scale-[1.02] hover:bg-brand-hover active:scale-[0.98]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="-ml-1 mr-3 size-5 animate-spin motion-reduce:animate-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <LandingIcon name="arrow-right" className="size-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </Reveal>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Your review has been submitted successfully. It will be published after approval."
      />
    </section>
  );
}
