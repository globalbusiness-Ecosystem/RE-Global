"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context";
import { AuthLoadingScreen } from "./auth-loading-screen";
import { OfflineBanner } from "./offline-banner";
import { Toaster } from "sonner";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { useOnlineStatus } from "@/hooks/use-online-status";

function AppContent({ children }: { children: ReactNode }) {
  const { isInitialized, authMessage } = usePiAuth();
  const { showBanner, setShowBanner } = useOnlineStatus();
  
  useServiceWorker();
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  const shouldShowLoading = !isInitialized;
  
  if (shouldShowLoading) {
    return <AuthLoadingScreen />;
  }
  return (
    <>
      <OfflineBanner isVisible={showBanner} onClose={() => setShowBanner(false)} />
      {children}
      <Toaster
        position="top-center"
        theme="dark"
        richColors
        expand
        style={{
          '--colors-error-bg': 'oklch(0.68 0.16 70)',
          '--colors-error-text': 'oklch(0.1 0 0)',
          '--colors-error-border': 'oklch(0.68 0.16 70)',
        } as React.CSSProperties}
      />
    </>
  );
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <PiAuthProvider>
      <AppContent>{children}</AppContent>
    </PiAuthProvider>
  );
}
