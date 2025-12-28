/**
 * Upload Service untuk Template Thumbnail
 * Handle file uploads to Supabase Storage
 */

import { supabase, SUPABASE_BUCKET_NAME } from "../lib/supabase";

/**
 * Upload thumbnail untuk template
 * Creates organized folder structure: thumbnails/templates/{templateId}/
 * 
 * @param {File} file - Image file
 * @param {string} templateId - Template ID (optional, untuk folderisasi)
 * @returns {Promise<Object>} { success: boolean, url: string, path?: string, error?: string }
 * 
 * @example
 * // Upload untuk template dengan ID "template123"
 * uploadTemplateThumbnail(file, "template123")
 * // Result: thumbnails/templates/template123/{timestamp}-{random}.jpg
 */
export async function uploadTemplateThumbnail(file, templateId = null) {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size exceeds 5MB limit");
    }

    // Generate file name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const generatedFileName = `${timestamp}-${randomString}.${fileExtension}`;

    // Build folder path with organized structure
    // Structure: thumbnails/templates/{templateId}/
    let folderPath;
    if (templateId) {
      // Organized by template ID: thumbnails/templates/template123/
      folderPath = `thumbnails/templates/${templateId}`;
    } else {
      // Fallback: thumbnails/templates/
      folderPath = "thumbnails/templates";
    }

    // Ensure folderPath doesn't have trailing slash
    const cleanFolderPath = folderPath.replace(/\/$/, "");
    const finalFileName = `${cleanFolderPath}/${generatedFileName}`;

    console.log("📤 [Upload] Uploading template thumbnail:", {
      fileName: finalFileName,
      fileSize: file.size,
      fileType: file.type,
      bucket: SUPABASE_BUCKET_NAME,
      folderPath: cleanFolderPath,
      templateId,
    });

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(finalFileName, file, {
        cacheControl: "3600",
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error("❌ [Upload] Upload error:", error);
      throw new Error(error.message || "Failed to upload file");
    }

    console.log("✅ [Upload] Upload successful:", data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .getPublicUrl(finalFileName);

    const publicUrl = urlData?.publicUrl;

    if (!publicUrl) {
      throw new Error("Failed to get public URL");
    }

    console.log("🔗 [Upload] Public URL:", publicUrl);

    return {
      success: true,
      url: publicUrl,
      path: finalFileName,
    };
  } catch (error) {
    console.error("❌ [Upload] Error:", error);
    return {
      success: false,
      url: null,
      error: error.message || "Failed to upload file",
    };
  }
}

/**
 * Delete thumbnail dari Supabase Storage
 * @param {string} filePath - Path to file in bucket
 * @returns {Promise<Object>} { success: boolean, error?: string }
 */
export async function deleteTemplateThumbnail(filePath) {
  try {
    if (!filePath) {
      throw new Error("No file path provided");
    }

    console.log("🗑️ [Upload] Deleting file:", filePath);

    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("❌ [Upload] Delete error:", error);
      throw new Error(error.message || "Failed to delete file");
    }

    console.log("✅ [Upload] Delete successful");

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ [Upload] Delete error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete file",
    };
  }
}

