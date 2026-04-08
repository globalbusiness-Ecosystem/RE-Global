"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { PI_NETWORK_CONFIG } from "@/lib/system-config";
import type {
  Product,
  SDKLiteInstance,
  UserPurchaseBalance,
} from "@/lib/sdklite-types";

interface PiAuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  authMessage: string;
  hasError: boolean;
  sdk: SDKLiteInstance | null;
  products: Product[] | null;
  restoredPurchases: UserPurchaseBalance[] | null;
  reinitialize: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.Pi !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      reject(new Error("SDK URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => {
      console.log("Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load Pi SDK script");
      reject(new Error("Failed to load Pi SDK script"));
    };

    document.head.appendChild(script);
  });
};

const loadSDKLite = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.SDKLite !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_LITE_URL) {
      reject(new Error("SDKLite URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_LITE_URL;
    script.async = true;

    script.onload = () => {
      console.log("SDKLite script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load SDKLite script");
      reject(new Error("Failed to load SDKLite script"));
    };

    document.head.appendChild(script);
  });
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [hasError, setHasError] = useState(false);
  const [sdk, setSdk] = useState<SDKLiteInstance | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [restoredPurchases, setRestoredPurchases] = useState<
    UserPurchaseBalance[] | null
  >(null);

  // Log when provider mounts
  useEffect(() => {
    console.log("[v0] [PiAuthProvider] Mounted, initializing...");
  }, []);

  // Log when isInitialized changes
  useEffect(() => {
    console.log("[v0] [PiAuthProvider] isInitialized changed to:", isInitialized);
  }, [isInitialized]);

  const fetchProducts = async (sdkInstance: SDKLiteInstance): Promise<void> => {
    try {
      const { products } = await sdkInstance.state.products();
      setProducts(products);
    } catch (e) {
      console.error("Failed to load products:", e);
      setProducts([]);
    }
  };

  const initialize = async () => {
    console.log("[PiAuth] Initialize called");
    // Detect if running in Pi Browser
    const isPiBrowser = typeof window !== "undefined" && typeof (window as any).Pi !== "undefined";

    console.log("[PiAuth] isPiBrowser:", isPiBrowser);

    if (!isPiBrowser) {
      // Not in Pi Browser - skip authentication and show app normally
      console.log("[v0] [PiAuth] Not in Pi Browser, skipping authentication");
      console.log("[v0] [PiAuth] About to set states for non-Pi Browser mode");
      // Use flushSync to ensure state updates are applied immediately
      flushSync(() => {
        setIsAuthenticated(false);
        setAuthMessage("App loaded (non-Pi Browser mode)");
        setIsInitialized(true);
      });
      console.log("[v0] [PiAuth] State updates flushed for non-Pi Browser mode");
      return;
    }

    // Continue with existing Pi.authenticate() flow
    setHasError(false);
    setRestoredPurchases(null);
    try {
      setAuthMessage("Loading Pi SDK...");
      await loadPiSDK();
      setAuthMessage("Initializing Pi Network...");
      await window.Pi.init({
        version: "2.0",
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
      });
      setAuthMessage("Loading SDKLite...");
      await loadSDKLite();

      setAuthMessage("Initializing SDKLite...");
      const sdkInstance = await window.SDKLite.init();
      setAuthMessage("Logging in...");
      const success = await sdkInstance.login();
      if (!success) {
        throw new Error("Login failed. Please try again.");
      }

      setSdk(sdkInstance);
      setIsAuthenticated(true);
      await fetchProducts(sdkInstance);

      try {
        const { purchases } = await sdkInstance.state.restore();
        setRestoredPurchases(purchases);
        console.log("[PiAuth] Purchases restored", purchases);
      } catch (e) {
        console.error("[PiAuth] Failed to restore purchases:", e);
        setRestoredPurchases([]);
      }
    } catch (err) {
      console.error("SDKLite initialization failed:", err);
      setHasError(true);
      setAuthMessage(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again.",
      );
    } finally {
      console.log("[PiAuth] Setting isInitialized to true in finally");
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    console.log("[v0] [PiAuthProvider] useEffect running, calling initialize");
    initialize();
    console.log("[v0] [PiAuthProvider] initialize called");
  }, []);

  const value: PiAuthContextType = {
    isAuthenticated,
    isInitialized,
    authMessage,
    hasError,
    sdk,
    products,
    restoredPurchases,
    reinitialize: initialize,
  };

  console.log("[v0] [PiAuthProvider] Providing context with isInitialized:", isInitialized);

  return (
    <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}
