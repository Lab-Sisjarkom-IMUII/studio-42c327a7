// Template Uploader Auth API Service
import apiClient from "../api-client";

/**
 * Register template uploader
 * @param {Object} data - Registration data
 * @param {string} data.username - Username (3-50 chars, unique)
 * @param {string} data.email - Email (valid format, unique)
 * @param {string} data.password - Password (min 6 chars)
 * @param {string} [data.name] - Name (optional)
 * @returns {Promise<Object>} Response dengan token dan uploader data
 */

export async function register(data) {
  try {
    const response = await apiClient.post("/template-uploaders/register", data);
    
    // Response format: { success: true, data: { success: true, token: "...", uploader: {...} }, message: "..." }
    const result = response.data;
    
    if (result.success && result.data?.token) {
      // Save token to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("uploader-token", result.data.token);
        localStorage.setItem("uploader-data", JSON.stringify(result.data.uploader));
      }
    }
    
    return {
      success: true,
      token: result.data?.token,
      uploader: result.data?.uploader,
      message: result.message || "Registration successful",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Registration failed",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Login template uploader
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Response dengan token dan uploader data
 */
export async function login(credentials) {
  try {
    const response = await apiClient.post("/template-uploaders/auth/login", credentials);
    
    const result = response.data;
    
    if (result.success && result.data?.token) {
      // Save token to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("uploader-token", result.data.token);
        localStorage.setItem("uploader-data", JSON.stringify(result.data.uploader));
      }
    }
    
    return {
      success: true,
      token: result.data?.token,
      uploader: result.data?.uploader,
      message: result.message || "Login successful",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Login failed",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Logout - clear token from localStorage
 */
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("uploader-token");
    localStorage.removeItem("uploader-data");
  }
}

/**
 * Get current uploader profile
 * @returns {Promise<Object>} Uploader data
 */
export async function getProfile() {
  try {
    const response = await apiClient.get("/template-uploaders/me");
    const result = response.data;
    
    return {
      success: true,
      data: result.data,
      message: result.message || "Profile retrieved successfully",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to get profile",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Update uploader profile
 * @param {Object} data - Update data
 * @param {string} [data.name] - Name (optional)
 * @param {string} [data.email] - Email (optional, must be unique)
 * @returns {Promise<Object>} Updated uploader data
 */
export async function updateProfile(data) {
  try {
    const response = await apiClient.put("/template-uploaders/me", data);
    const result = response.data;
    
    // Update localStorage jika ada perubahan
    if (result.data && typeof window !== "undefined") {
      localStorage.setItem("uploader-data", JSON.stringify(result.data));
    }
    
    return {
      success: true,
      data: result.data,
      message: result.message || "Profile updated successfully",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to update profile",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("uploader-token");
}

/**
 * Get stored uploader data
 * @returns {Object|null}
 */
export function getStoredUploader() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("uploader-data");
  return data ? JSON.parse(data) : null;
}

