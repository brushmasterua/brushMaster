"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (url: string, publicId: string) => void;
  onRemove?: () => void;
  currentImage?: string;
}

export function ImageUpload({ onUpload, onRemove, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Перевірка типу файлу
    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, оберіть зображення");
      return;
    }

    // Перевірка розміру (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Розмір зображення не повинен перевищувати 5MB");
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setPreview(data.url);
        onUpload(data.url, data.publicId);
      } else {
        alert("Помилка завантаження");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка завантаження зображення");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onRemove) onRemove();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">Зображення</label>
      
      <div className="relative">
        {preview ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#f97316] transition"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500 text-center px-2">
                  Завантажити
                </span>
              </>
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>
      
      <p className="text-xs text-gray-400">
        Рекомендований розмір: 500x500px, макс. 5MB
      </p>
    </div>
  );
}