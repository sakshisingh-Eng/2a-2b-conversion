import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, FileJson, X } from 'lucide-react';

interface UploadCardProps {
  title: string;
  subtitle: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  iconType: 'excel' | 'json';
  disabled?: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  title,
  subtitle,
  accept,
  file,
  onChange,
  iconType,
  disabled = false
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTime, setUploadTime] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = accept.split(',').map(ext => ext.trim().replace('.', '').toLowerCase());
    
    if (ext && acceptedExtensions.includes(ext)) {
      onChange(selectedFile);
      setUploadTime(new Date().toLocaleTimeString());
    } else {
      alert(`Invalid file format. Accepted formats: ${accept}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setUploadTime(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 
        ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100/50 dark:bg-slate-900/30 border-slate-300 dark:border-slate-800' : ''}
        ${isDragActive 
          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400' 
          : 'border-slate-300 hover:border-brand-400 dark:border-slate-800 dark:hover:border-brand-500 bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-900/80'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {file ? (
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${
              iconType === 'excel' 
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
            }`}>
              {iconType === 'excel' ? <FileSpreadsheet className="w-6 h-6" /> : <FileJson className="w-6 h-6" />}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[200px] md:max-w-xs">
                {file.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatSize(file.size)} • Uploaded at {uploadTime}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={clearFile}
            disabled={disabled}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-2 py-2">
          <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-505 group-hover:scale-105 transition-transform duration-200">
            <Upload className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {title}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              {subtitle}
            </span>
            <button
              type="button"
              className="mt-2 px-3 py-1.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:text-brand-400 dark:bg-brand-950/40 dark:hover:bg-brand-900/30 rounded-lg border border-brand-200/50 dark:border-brand-900/20 transition-all shadow-sm"
              disabled={disabled}
            >
              Browse Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
