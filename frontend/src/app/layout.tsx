import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["normal"],
  display: "swap",
  variable: "--font-montserrat-alternates",
});

export const metadata: Metadata = {
  title: "Medicare",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserratAlternates.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
