'use client';

import { useState } from 'react';

export interface HeroImageUploaderProps {
  onUpload: (url: string) => void;
  publicId?: string;
}

const HeroImageUploader: React.FC<HeroImageUploaderProps> = ({ onUpload, publicId }) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      uploadFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadFile(file);
    }
  };

  const uploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        // Set maximum dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Create a canvas to draw the downscaled image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert the canvas to a data URL (base64 string)
          const dataUrl = canvas.toDataURL(file.type);
          try {
            const res = await fetch('/api/main/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: dataUrl, publicId, type: 'hero' }),
            });
            if (res.ok) {
              const data = await res.json();
              onUpload(data.url);
            } else {
              const errorData = await res.json();
              alert(errorData.error || 'Failed to upload image');
            }
          } catch (err: unknown) {
            alert(err);
          }
        }
      };
      // Set the source of the image to the file's data URL
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUpload(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-4 border-2 border-dashed rounded mb-2 ${
          dragActive ? 'border-blue-500' : 'border-gray-300'
        }`}
      >
        <p className="text-center">Drag and drop an image file here</p>
      </div>
      <div className="mb-2">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <form onSubmit={handleUrlSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Or enter image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Set Image
        </button>
      </form>
    </div>
  );
};

export default HeroImageUploader;
