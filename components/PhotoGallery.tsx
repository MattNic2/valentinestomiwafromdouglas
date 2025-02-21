"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import EditPhotos from "./EditPhotos";
import heic2any from "heic2any";

interface Photo {
  id: number;
  url: string;
  order: number;
}

export default function PhotoGallery() {
  const fallbackPhotos = [
    {
      id: 1,
      url: "https://fvipqaosxgefguxgblfc.supabase.co/storage/v1/object/public/PhotosOfMiwaAndDouglas//33f68bfc-5166-44f6-8834-2518915b87cc1739760779763-qgu7e35fnom.jpg",
      order: 0,
    },
    {
      id: 2,
      url: "https://fvipqaosxgefguxgblfc.supabase.co/storage/v1/object/public/PhotosOfMiwaAndDouglas//ee5c525c-49a6-415f-a1fe-9d7407196e5d1739697755720-fpjc83gjfog.png",
      order: 1,
    },
    {
      id: 3,
      url: "https://fvipqaosxgefguxgblfc.supabase.co/storage/v1/object/public/PhotosOfMiwaAndDouglas//ee5c525c-49a6-415f-a1fe-9d7407196e5d1739698611491-gzh3o7akq2c.jpg",
      order: 2,
    },
    {
      id: 4,
      url: "https://fvipqaosxgefguxgblfc.supabase.co/storage/v1/object/public/PhotosOfMiwaAndDouglas//ee5c525c-49a6-415f-a1fe-9d7407196e5d1739700916782-r8w6g9jpao.jpg",
      order: 3,
    },
  ];
  const [photos, setPhotos] = useState<Photo[]>(fallbackPhotos);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [deletePhotoUrl, setDeletePhotoUrl] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getCurrentUser();
  }, []);

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

  useEffect(() => {
    const handlePhotoUpload = () => {
      fetchPhotos();
    };

    window.addEventListener("photoUploaded", handlePhotoUpload);
    return () => {
      window.removeEventListener("photoUploaded", handlePhotoUpload);
    };
  }, []);

  async function fetchPhotos() {
    try {
      console.log("Fetching all photos from database...");

      const { data: photoData, error: dbError } = await supabase
        .from("PhotosOfMiwaAndDouglas")
        .select("id, url, order")
        .order("order", { ascending: true });

      console.log("Photo fetch response:", { data: photoData, error: dbError });

      if (dbError) throw dbError;

      if (photoData?.length > 0) {
        // Validate URLs and filter out invalid ones
        const validPhotos = photoData.filter((photo) => {
          try {
            // Check if it's a valid URL
            new URL(photo.url);

            // Check if it's a Supabase storage URL
            const isSupabaseUrl = photo.url.includes(
              "supabase.co/storage/v1/object/public"
            );

            if (!isSupabaseUrl) {
              console.warn("Invalid photo URL (not from Supabase):", photo.url);
              return false;
            }

            return true;
          } catch (e) {
            console.warn("Invalid photo URL:", photo.url);
            return false;
          }
        });

        console.log(
          `Found ${photoData.length} photos, ${validPhotos.length} are valid`
        );

        if (validPhotos.length > 0) {
          setPhotos(validPhotos);
          console.log("Valid photos loaded:", validPhotos.length);
        } else {
          console.log("No valid photos found");
          setPhotos(fallbackPhotos);
        }
      } else {
        console.log("No photos found in database");
        setPhotos(fallbackPhotos);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Failed to load photos. Please try again later.");
    }
  }

  function isValidPhotoUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.href.includes("supabase.co/storage/v1/object/public");
    } catch (e) {
      return false;
    }
  }

  const convertHEICToJPEG = async (file: File): Promise<File> => {
    setIsConverting(true);
    try {
      // Check if file is HEIC
      if (file.type === "image/heic" || file.type === "image/heif") {
        console.log("Converting HEIC to JPEG...");

        // Convert to blob
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.85, // Adjust quality to meet size requirements
        });

        // Convert blob or blob array to single file
        const jpegFile = new File(
          [convertedBlob instanceof Blob ? convertedBlob : convertedBlob[0]],
          file.name.replace(/\.(heic|HEIC)$/, ".jpg"),
          { type: "image/jpeg" }
        );

        console.log("HEIC conversion successful");
        return jpegFile;
      }

      // Return original file if not HEIC
      return file;
    } finally {
      setIsConverting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Upload initiated");

    if (!user) {
      console.log("No user found:", user);
      setError("Please sign in to upload photos");
      return;
    }
    console.log("User authenticated:", user.id);

    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Basic validation
      if (
        !file.type.startsWith("image/") &&
        !file.name.toLowerCase().endsWith(".heic")
      ) {
        throw new Error("Please upload an image file");
      }

      // Convert HEIC if necessary and get processed file
      const processedFile = await convertHEICToJPEG(file);

      // Validate file size after potential conversion
      if (processedFile.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      console.log("Processed file:", {
        name: processedFile.name,
        type: processedFile.type,
        size: `${(processedFile.size / 1024 / 1024).toFixed(2)}MB`,
      });

      // Create a unique filename
      const fileExt =
        processedFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("PhotosOfMiwaAndDouglas")
        .upload(`${user.id}${fileName}`, processedFile, {
          contentType: processedFile.type, // Ensure correct content type is set
        });

      if (uploadError) throw uploadError;

      // Get the public URL with detailed logging
      console.log("Getting public URL...");
      const publicUrlResponse = supabase.storage
        .from("PhotosOfMiwaAndDouglas")
        .getPublicUrl(`${user.id}${fileName}`);

      console.log("Full public URL response:", publicUrlResponse);

      const {
        data: { publicUrl },
      } = publicUrlResponse;

      console.log("URL details:", {
        fullUrl: publicUrl,
        bucket: "PhotosOfMiwaAndDouglas",
        path: `${user.id}${fileName}`,
      });

      if (!isValidPhotoUrl(publicUrl)) {
        console.error("Invalid URL generated:", publicUrl);
        throw new Error("Generated URL is invalid");
      }

      // Get current highest order
      const { data: maxOrderData } = await supabase
        .from("PhotosOfMiwaAndDouglas")
        .select("order")
        .order("order", { ascending: false })
        .limit(1);

      const nextOrder =
        maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].order + 1 : 0;

      // Store in database with order
      const { error: dbError } = await supabase
        .from("PhotosOfMiwaAndDouglas")
        .insert({
          user_id: user.id,
          url: publicUrl,
          order: nextOrder,
        });

      console.log("Database insert response:", {
        error: dbError,
        data: { user_id: user.id, url: publicUrl, order: nextOrder },
      });

      if (dbError) throw dbError;

      // Refresh the photo list
      console.log("Refreshing photo list...");
      await fetchPhotos();
      console.log("Photo list refreshed");
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload photo. Please try again."
      );
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = "";
    }
  };

  const handleDeletePhoto = async (photoToDelete: Photo) => {
    try {
      const urlPath = new URL(photoToDelete.url).pathname;
      const filePath = urlPath.split("/public/")[1];

      // Delete from storage - Fix bucket name
      const { error: storageError } = await supabase.storage
        .from("PhotosOfMiwaAndDouglas") // Match the bucket name used in upload
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("PhotosOfMiwaAndDouglas")
        .delete()
        .match({ id: photoToDelete.id });

      if (dbError) throw dbError;

      // Update main photos state
      setPhotos(photos.filter((photo) => photo.id !== photoToDelete.id));
      setError(null);
    } catch (error) {
      console.error("Error deleting photo:", error);
      setError("Failed to delete photo. Please try again.");
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleEditClose = () => {
    setIsEditMode(false);
  };

  const handleEditSave = (updatedPhotos: Photo[]) => {
    setPhotos(updatedPhotos);
    setIsEditMode(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-1000 group ${
                currentPhotoIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={photo.url}
                alt={`Our memory ${index + 1}`}
                fill
                className="object-cover"
              />
              {currentPhotoIndex === index && user && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                    aria-label="Delete photo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
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
        <div className="flex space-x-4">
          <label
            htmlFor="photo-upload"
            className={`cursor-pointer bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full transition-colors ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Upload a Photo"}
          </label>
          {user && (
            <button
              onClick={handleEditClick}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition-colors"
            >
              Edit Photos
            </button>
          )}
        </div>
        <input
          id="photo-upload"
          type="file"
          accept="image/*,.heic,.HEIC"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {uploading && (
          <p className="mt-2 text-sm text-gray-500">
            {isConverting ? "Converting image..." : "Uploading..."}
          </p>
        )}
      </div>

      <EditPhotos
        isOpen={isEditMode}
        photos={photos}
        userId={user?.id || null}
        onClose={handleEditClose}
        onSave={handleEditSave}
        onDelete={handleDeletePhoto}
      />

      {/* Delete Confirmation Dialog */}
      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Photo
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this photo? This action
                      cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        handleDeletePhoto(photos[currentPhotoIndex]);
                        setIsDeleteDialogOpen(false);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
