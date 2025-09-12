/** biome-ignore-all lint/style/noNonNullAssertion: ignore this */
/** biome-ignore-all lint/a11y/useButtonType: ignore this */

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Canteen App",
  description: "Order your meals with ease 🚀",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  if (userId) {
    await supabase.from("users").upsert({ clerk_id: userId });
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50`}
        >
          <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
              {/* Brand */}
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
              >
                🍴 Tag2Eat
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-4">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium transition-all hover:bg-indigo-600 hover:scale-105"
                >
                  Menu
                </Link>
                <SignedOut>
                  <SignInButton>
                    <button className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium transition-all hover:bg-gray-300 hover:scale-105">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium transition-all hover:scale-105">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/review-cart"
                    className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium transition-all hover:bg-green-600 hover:scale-105"
                  >
                    Review Cart
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-9 h-9 rounded-full ring-2 ring-indigo-400 transition-all hover:ring-purple-500",
                      },
                    }}
                  />
                </SignedIn>
              </nav>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 py-6">
            {children}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
