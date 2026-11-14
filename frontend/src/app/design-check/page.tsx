import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Dashboard } from "./_components/dashboard";

// Internal design-system dashboard. Not linked from any page, not indexed, and not served in
// production: the route answers 404 when NODE_ENV is "production".
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

export default function DesignCheckPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Dashboard />;
}
