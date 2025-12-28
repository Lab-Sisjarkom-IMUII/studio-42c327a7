// Custom hook untuk template uploader authentication
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/lib/api/auth";

/**
 * Hook untuk authentication state
 * @returns {Object} - { uploader, isLoading, isAuthenticated, login, register, logout, refresh }
 */
export function useAuth() {
  const router = useRouter();
  const [uploader, setUploader] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load uploader from localStorage on mount
  useEffect(() => {
    const loadUploader = async () => {
      try {
        const storedUploader = authApi.getStoredUploader();
        if (storedUploader && authApi.isAuthenticated()) {
          // Verify token dengan get profile
          try {
            const result = await authApi.getProfile();
            if (result.success) {
              setUploader(result.data);
            } else {
              // Token invalid, clear storage
              authApi.logout();
              setUploader(null);
            }
          } catch (error) {
            // Token invalid, clear storage
            authApi.logout();
            setUploader(null);
          }
        } else {
          setUploader(null);
        }
      } catch (error) {
        console.error("Error loading uploader:", error);
        setUploader(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUploader();
  }, []);

  // Listen untuk perubahan token di localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e) => {
      if (e.key === "uploader-token" || e.key === "uploader-data") {
        const storedUploader = authApi.getStoredUploader();
        setUploader(storedUploader);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const result = await authApi.login(credentials);
      if (result.success) {
        setUploader(result.uploader);
        return { success: true, uploader: result.uploader };
      }
      return { success: false, error: result.message };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const result = await authApi.register(data);
      if (result.success) {
        setUploader(result.uploader);
        return { success: true, uploader: result.uploader };
      }
      return { success: false, error: result.message };
    } catch (error) {
      return { success: false, error: error.message || "Registration failed" };
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUploader(null);
    router.push("/login");
  }, [router]);

  const refresh = useCallback(async () => {
    try {
      const result = await authApi.getProfile();
      if (result.success) {
        setUploader(result.data);
        return { success: true, uploader: result.data };
      }
      return { success: false };
    } catch (error) {
      authApi.logout();
      setUploader(null);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    uploader,
    isLoading,
    isAuthenticated: !!uploader && authApi.isAuthenticated(),
    login,
    register,
    logout,
    refresh,
  };
}

