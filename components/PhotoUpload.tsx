"use client"

import { useState } from "react"

export default function PhotoUpload() {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    // In a real application, you'd upload to a server here
    // For this example, we'll just simulate a delay and store in localStorage
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      const photos = JSON.parse(localStorage.getItem("photos") || "[]")
      photos.push(base64String)
      localStorage.setItem("photos", JSON.stringify(photos))
      setUploading(false)
      window.dispatchEvent(new Event("storage"))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="mb-6">
      <label htmlFor="photo-upload" className="block mb-2 text-sm font-medium text-gray-900">
        Upload a new photo
      </label>
      <input
        type="file"
        id="photo-upload"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        disabled={uploading}
      />
      {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
    </div>
  )
}

