"use client";

import { ThemeProvider } from "@/components/theme-provider"
import Loading from "@/components/loading"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"

export default function ClientLayout({
  children,
}: {
  children: ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show loading for initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds minimum loading time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show loading on route changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds minimum loading time

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="replin-theme"
      disableTransitionOnChange
    >
      {isLoading && <Loading />}
      {children}
    </ThemeProvider>
  );
} 