// Template Uploader Templates API Service
import apiClient from "../api-client";
import axios from "axios";

// Helper untuk get base URL tanpa auth (untuk public endpoints)
function getPublicBaseURL() {
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URL || 
    (process.env.NODE_ENV === "production" 
      ? "https://api.imuii.id/api/v1" 
      : "http://localhost:8080/api/v1");
  
  // Normalize URL
  let url = baseURL.trim().replace(/\/+$/, "");
  if (!url.endsWith("/api/v1")) {
    if (!url.endsWith("/")) {
      url += "/";
    }
    url += "api/v1";
  }
  
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (process.env.NODE_ENV === "production") {
      url = "https://" + url;
    } else {
      url = "http://" + url;
    }
  }
  
  return url;
}

// Public API client (tanpa auth token)
const publicApiClient = axios.create({
  baseURL: getPublicBaseURL(),
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/**
 * Get all templates (PUBLIC - tidak perlu auth)
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page (max 100)
 * @returns {Promise<Object>} Templates response dengan pagination
 */
export async function getPublicTemplates(params = {}) {
  try {
    const { page = 1, limit = 10 } = params;
    const response = await publicApiClient.get("/templates", {
      params: { page, limit },
    });
    
    const result = response.data;
    
    return {
      success: true,
      data: result.data,
      message: result.message || "Templates retrieved successfully",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to get templates",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Get all templates (for uploader - requires auth)
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page (max 100)
 * @returns {Promise<Object>} Templates response dengan pagination
 */
export async function getTemplates(params = {}) {
  try {
    const { page = 1, limit = 10 } = params;
    const response = await apiClient.get("/template-uploaders/templates", {
      params: { page, limit },
    });
    
    const result = response.data;
    
    return {
      success: true,
      data: result.data,
      message: result.message || "Templates retrieved successfully",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to get templates",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Get template by ID (PUBLIC - tidak perlu auth)
 * @param {string} id - Template ID
 * @returns {Promise<Object>} Template data
 */
export async function getPublicTemplateById(id) {
  try {
    const response = await publicApiClient.get(`/templates/${id}`);
    const result = response.data;
    
    return {
      success: true,
      data: result.data,
      message: result.message || "Template retrieved successfully",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to get template",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Get template by ID (for uploader - requires auth)
 * @param {string} id - Template ID
 * @returns {Promise<Object>} Template data
 */
export async function getTemplateById(id) {
  try {
    const response = await apiClient.get(`/template-uploaders/templates/${id}`);
    const result = response.data;
    
    return {
      success: true,
      data: result.data,
      message: result.message || "Template retrieved successfully",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to get template",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Create template
 * @param {Object} data - Template data
 * @param {string} data.name - Template name (required, 1-100 chars)
 * @param {string} [data.description] - Description (optional, max 500 chars)
 * @param {string} [data.html_template] - HTML template (optional)
 * @param {string} [data.thumbnail_url] - Thumbnail URL (optional)
 * @param {Object} data.fields - Fields object (required)
 * @param {Array} [data.sections] - Sections array (optional)
 * @returns {Promise<Object>} Created template data
 */
export async function createTemplate(data) {
  try {
    const response = await apiClient.post("/template-uploaders/templates", data);
    const result = response.data;
    
    return {
      success: true,
      data: result.data,
      message: result.message || "Template created successfully",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to create template",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Update template (only own templates)
 * @param {string} id - Template ID
 * @param {Object} data - Update data (all optional)
 * @param {string} [data.name] - Template name (1-100 chars)
 * @param {string} [data.description] - Description (max 500 chars)
 * @param {string} [data.html_template] - HTML template
 * @param {string} [data.thumbnail_url] - Thumbnail URL
 * @param {Object} [data.fields] - Fields object
 * @returns {Promise<Object>} Updated template data
 */
export async function updateTemplate(id, data) {
  try {
    const response = await apiClient.put(`/template-uploaders/templates/${id}`, data);
    const result = response.data;
    
    return {
      success: true,
      data: result.data,
      message: result.message || "Template updated successfully",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to update template",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

/**
 * Delete template (only own templates)
 * @param {string} id - Template ID
 * @returns {Promise<Object>} Delete response
 */
export async function deleteTemplate(id) {
  try {
    const response = await apiClient.delete(`/template-uploaders/templates/${id}`);
    const result = response.data;
    
    return {
      success: true,
      message: result.message || "Template deleted successfully",
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to delete template",
      error: error.error || error.message,
      code: error.code || 500,
    };
  }
}

