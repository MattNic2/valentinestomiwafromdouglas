"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<string[]>([
    "https://fvipqaosxgefguxgblfc.supabase.co/storage/v1/object/public/photos//4BA83CCB-64B4-4124-AB39-34ABFB8546F1.PNG",
    "https://fvipqaosxgefguxgblfc.supabase.co/storage/v1/object/public/photos//Miwa%20collage.png",
    "https://fvipqaosxgefguxgblfc.supabase.co/storage/v1/object/public/photos//IMG_6552.jpg",
    " https://fvipqaosxgefguxgblfc.supabase.co/storage/v1/object/public/photos//IMG_4888.jpg",
  ]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;

    const timer = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [photos]);

  async function fetchPhotos() {
    try {
      const { data, error } = await supabase.storage
        .from("photos") // Replace 'photos' with your bucket name
        .list(); // Lists all files in the bucket

      if (error) throw error;

      console.log("Fetched photos:", data);
      if (data.length > 0) {
        setPhotos(
          data.map((photo) => {
            // Construct the URL using the file path
            return supabase.storage.from("photos").getPublicUrl(photo.name).data
              .publicUrl;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Failed to load photos. Please try again later.");
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("Uploading file:", filePath);
      console.log("Supabase exists:", supabase);
      const { data, error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file);
      console.log("Upload storage:", data);
      if (uploadError) throw uploadError;

      console.log("File uploaded successfully");

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");

      console.log("Public URL:", publicUrlData.publicUrl);

      const { error: insertError } = await supabase
        .from("photos")
        .insert({ url: publicUrlData.publicUrl });

      if (insertError) throw insertError;

      console.log("Photo URL inserted into database");
      await fetchPhotos();
    } catch (error) {
      console.error("Error uploading photo:", error);
      setError("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentPhotoIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={photo || "/placeholder.svg"}
                alt={`Our memory ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-pink-100 text-rose-500">
            <p>
              {error ||
                "Upload your favorite photos of us to start the slideshow!"}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center space-y-2">
        <label
          htmlFor="photo-upload"
          className={`cursor-pointer bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full transition-colors ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "Uploading..." : "Upload a Photo"}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
