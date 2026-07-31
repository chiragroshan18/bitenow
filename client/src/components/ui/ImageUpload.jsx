import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { motion } from 'framer-motion';

function ImageUpload({ onUpload, label = 'Upload Image', className = '' }) {
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        setIsUploading(true);
        try {
          await onUpload(file);
        } finally {
          setIsUploading(false);
        }
      }
    }
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-orange-500 bg-orange-500/10' : 'border-white/20 hover:border-orange-500/50'}
          ${preview ? 'p-0 border-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium">Click to change</p>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
                <div className="text-white text-sm font-medium">Uploading...</div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-2">📷</div>
            <p className="text-white/60 text-sm">
              {isDragActive ? 'Drop the image here...' : label}
            </p>
            <p className="text-white/40 text-xs mt-1">Max 5MB • JPG, PNG, GIF, WebP</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;