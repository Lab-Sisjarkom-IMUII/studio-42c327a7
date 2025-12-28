/**
 * Supabase Client
 * Untuk upload file ke Supabase Storage
 */

import { createClient } from "@supabase/supabase-js";

// Supabase Configuration
// Menggunakan konfigurasi yang sama dengan imuii-portal
const SUPABASE_URL = "https://mjgoqvpqwgwicrkbidyj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ29xdnBxd2d3aWNya2JpZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDg1ODMsImV4cCI6MjA3Nzk4NDU4M30.XHw8qnxUsrc8picYeAtRo2LUrL45QNMEg32eAXHn2so";
const SUPABASE_BUCKET_NAME = "thumbnails";

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Get Supabase client instance
 * @returns {Object} Supabase client
 */
export function getSupabaseClient() {
  return supabase;
}

export { SUPABASE_BUCKET_NAME };

