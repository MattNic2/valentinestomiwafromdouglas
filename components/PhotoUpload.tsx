"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function PhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Please sign in to upload photos");
      }

      // Validate file
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      // Get the current highest order number
      const { data: maxOrderData, error: orderError } = await supabase
        .from("PhotosOfMiwaAndDouglas")
        .select("order")
        .order("order", { ascending: false })
        .limit(1);

      if (orderError) throw orderError;

      const nextOrder =
        maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].order + 1 : 0;

      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      // Upload to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("PhotosOfMiwaAndDouglas")
        .upload(`${user.id}${fileName}`, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("PhotosOfMiwaAndDouglas")
        .getPublicUrl(`${user.id}${fileName}`);

      // Store in database with order
      const { error: dbError } = await supabase
        .from("PhotosOfMiwaAndDouglas")
        .insert({
          user_id: user.id,
          url: publicUrl,
          order: nextOrder, // Add new photos at the end
        });

      if (dbError) throw dbError;

      // Trigger refresh of gallery
      window.dispatchEvent(new Event("photoUploaded"));
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload photo"
      );
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = "";
    }
  };

  return (
    <div className="mb-6">
      <label
        htmlFor="photo-upload"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Upload a new photo
      </label>
      <input
        type="file"
        id="photo-upload"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={uploading}
      />
      {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
