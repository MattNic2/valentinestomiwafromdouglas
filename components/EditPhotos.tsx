"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import Image from "next/image";
import { supabase } from "../lib/supabase";

interface Photo {
  id: number;
  url: string;
  order: number;
}

interface EditPhotosProps {
  isOpen: boolean;
  photos: Photo[];
  userId: string | null;
  onClose: () => void;
  onSave: (photos: Photo[]) => void;
  onDelete: (photo: Photo) => Promise<void>;
}

export default function EditPhotos({
  isOpen,
  photos,
  userId,
  onClose,
  onSave,
  onDelete,
}: EditPhotosProps) {
  const [editedPhotos, setEditedPhotos] = useState<Photo[]>(photos);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Keep editedPhotos in sync with photos prop
  useEffect(() => {
    setEditedPhotos(photos);
  }, [photos]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(editedPhotos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEditedPhotos(items);
  };

  const handleDelete = async (photo: Photo) => {
    try {
      setIsDeleting(photo.id);
      setError(null);

      // Call the parent's onDelete function
      await onDelete(photo);

      // Update local state after successful deletion
      setEditedPhotos(editedPhotos.filter((p) => p.id !== photo.id));

      // Update the order of remaining photos
      const updatedPhotos = editedPhotos
        .filter((p) => p.id !== photo.id)
        .map((photo, index) => ({
          ...photo,
          order: index,
        }));

      // Update orders in database
      const { error: updateError } = await supabase
        .from("PhotosOfMiwaAndDouglas")
        .upsert(
          updatedPhotos.map((photo) => ({
            id: photo.id,
            order: photo.order,
            url: photo.url,
            user_id: userId,
          }))
        );

      if (updateError) throw updateError;

      // Update local state with new orders
      setEditedPhotos(updatedPhotos);
    } catch (error) {
      console.error("Error deleting photo:", error);
      setError("Failed to delete photo. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Update orders in database
      const updates = editedPhotos.map((photo, index) => ({
        id: photo.id,
        order: index,
        url: photo.url,
        user_id: userId,
      }));

      const { error } = await supabase
        .from("PhotosOfMiwaAndDouglas")
        .upsert(updates);

      if (error) throw error;

      onSave(editedPhotos);
    } catch (error) {
      console.error("Error saving changes:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-full p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Photos</h2>
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-500">{error}</div>}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="edit-photos">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {editedPhotos.map((photo, index) => (
                    <Draggable
                      key={photo.id.toString()}
                      draggableId={photo.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative aspect-square rounded-lg overflow-hidden group ${
                            snapshot.isDragging ? "shadow-lg" : ""
                          }`}
                        >
                          <Image
                            src={photo.url}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div
                            {...provided.dragHandleProps}
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all"
                          >
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-8 w-8 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8h16M4 16h16"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(photo)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving || isDeleting === photo.id}
                          >
                            {isDeleting === photo.id ? (
                              <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                            ) : (
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
                            )}
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
