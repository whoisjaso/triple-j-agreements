import React, { useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
}

export default function IdUpload({ label, value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const MAX = 1200;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) {
              height = Math.round((height * MAX) / width);
              width = MAX;
            } else {
              width = Math.round((width * MAX) / height);
              height = MAX;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Please upload an image under 10MB.');
      return;
    }

    try {
      const resized = await resizeImage(file);
      onChange(resized);
    } catch {
      alert('Failed to process image. Please try again.');
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-semibold tracking-widest uppercase text-luxury-ink/70">{label}</label>

      {value ? (
        <div className="relative border-2 border-luxury-gold/30 rounded-xl overflow-hidden bg-luxury-bg/30">
          <img
            src={value}
            alt="Customer ID"
            className="w-full max-h-[220px] object-contain p-2"
          />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-2 left-2 bg-green-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span>ID Captured</span>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-luxury-ink/15 rounded-xl p-6 bg-white/50 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-luxury-ink/5 rounded-full flex items-center justify-center">
              <Camera size={20} className="text-luxury-ink/40" />
            </div>
            <p className="text-xs text-luxury-ink/50">Upload or capture a photo of the customer's ID</p>
            <div className="flex space-x-3">
              <button
                onClick={() => cameraRef.current?.click()}
                className="px-4 py-2 bg-luxury-gold text-white rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-luxury-gold/90 transition-all flex items-center space-x-1.5 shadow-md"
              >
                <Camera size={12} />
                <span>Camera</span>
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 bg-luxury-ink text-luxury-gold rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-luxury-ink/90 transition-all flex items-center space-x-1.5 border border-luxury-gold/30"
              >
                <Upload size={12} />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
