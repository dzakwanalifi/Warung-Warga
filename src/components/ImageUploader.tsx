'use client';

import React, { useState, useRef } from 'react';
import { Plus, Camera, Upload } from 'lucide-react';
import { ImagePreview } from './ImagePreview';
import { cn } from '@/lib/utils';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesChange,
  maxImages = 5,
  className,
  disabled = false
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL for file
  const createImageFile = (file: File): ImageFile => {
    return {
      id: Math.random().toString(36).substring(2),
      file,
      preview: URL.createObjectURL(file)
    };
  };

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImageFiles: ImageFile[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal 5MB per file.');
        continue;
      }

      newImageFiles.push(createImageFile(file));
    }

    if (newImageFiles.length > 0) {
      const updatedImages = [...images, ...newImageFiles];
      setImages(updatedImages);
      onImagesChange(updatedImages.map(img => img.file));
    }
  };

  // Handle file input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
    // Reset input value to allow selecting same file again
    event.target.value = '';
  };

  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    if (!disabled) {
      handleFileSelect(event.dataTransfer.files);
    }
  };

  // Remove image
  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => {
      if (img.id === id) {
        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(img.preview);
        return false;
      }
      return true;
    });
    
    setImages(updatedImages);
    onImagesChange(updatedImages.map(img => img.file));
  };

  // Trigger file input
  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const canAddMore = images.length < maxImages && !disabled;

  return (
    <div className={cn('space-y-3u', className)}>
      {/* Images Grid */}
      <div className="flex flex-wrap gap-3u">
        {/* Existing Images */}
        {images.map((image) => (
          <ImagePreview
            key={image.id}
            src={image.preview}
            alt="Preview produk"
            onRemove={() => removeImage(image.id)}
          />
        ))}

        {/* Add Image Button */}
        {canAddMore && (
          <div
            className={cn(
              "w-24 h-24 rounded-lg border-2 border-dashed cursor-pointer",
              "flex flex-col items-center justify-center gap-1u",
              "transition-all duration-200",
              dragOver 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary hover:bg-surface-secondary",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "bg-primary/10 text-primary"
            )}>
              {dragOver ? (
                <Upload className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </div>
            <span className="text-caption text-text-secondary text-center">
              {dragOver ? 'Lepas file' : 'Tambah Foto'}
            </span>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-caption text-text-secondary">
        <p className="mb-1u">
          Unggah hingga {maxImages} foto produk ({images.length}/{maxImages})
        </p>
        <p>
          Format: JPG, PNG, WebP • Maksimal 5MB per file
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}; 