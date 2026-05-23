'use client';

import React, { useState, useRef } from 'react';
import { uploadAPI } from '@/services/api';
import Button from '@/components/ui/Button';

interface UploadedImage {
  url: string;
  key: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  max?: number;
}

export default function ImageUploader({ images, onChange, max = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const res = await uploadAPI.uploadImages(files, 'products');
      const newImages = res.data.images.map((img: any) => ({ url: img.url, key: img.key }));
      onChange([...images, ...newImages].slice(0, max));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro no upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setPrimary = (index: number) => {
    const updated = images.map((img, i) => ({ ...img, isPrimary: i === index }));
    onChange(updated);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border group">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setPrimary(i)}
                className="text-white text-xs bg-blue-600 px-1.5 py-0.5 rounded"
              >
                Capa
              </button>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-white text-xs bg-red-600 px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            {uploading ? '...' : '+'}
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
      <p className="text-xs text-gray-500">Formatos: JPG, PNG, WebP. Máximo {max} imagens.</p>
    </div>
  );
}
