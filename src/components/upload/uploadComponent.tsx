import { useState } from "react";

interface ImageUploaderProps {
  onUpload: (formdata: FormData) => void;
  setFile: (file: File) => void;
  file: File | null;
  model: string;
  fieldType: string;
}

export default function ImageUploader({
  onUpload,
  setFile,
  file,
  model,
  fieldType
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File | null): boolean => {
    if (!file) return false;

    const validTypes: string[] = ["image/jpeg", "image/png", "image/webp"];
    const validExtensions: string[] = [".jpg", ".jpeg", ".png", ".webp"];

    const hasValidType: boolean = validTypes.includes(file.type);
    const hasValidExtension: boolean = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    if (!hasValidType && !hasValidExtension) {
      setError("Please upload an image file (.jpg, .png, .webp)");
      return false;
    }

    const maxSize: number = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return false;
    }

    setError("");
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const formdata = new FormData();
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      formdata.append("file", droppedFile);
      formdata.append("model", model);
      formdata.append("field", fieldType);
      onUpload(formdata);
      setFile(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    const formdata = new FormData();
    if (selectedFile && validateFile(selectedFile)) {
      formdata.append("file", selectedFile);
      formdata.append("model", model);
      formdata.append("field", fieldType);
      onUpload(formdata);
      setFile(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes: string[] = ["Bytes", "KB", "MB"];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-fit flex items-center mb-2">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">
          Upload Image
        </h2>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border rounded-xl py-2 px-4 transition-all cursor-pointer ${
            isDragging
              ? "border-gray-500 bg-gray-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }`}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileInput}
            className="hidden"
            id="image-input"
          />

          <div className="flex items-center">
            <label htmlFor="image-input" className="cursor-pointer pb-2">
              <p className="text-primary-600 mb-1 text-xl font-semibold">
                Browse files to upload
              </p>
              <p className="text-sm text-gray-600 mb-2">
                PNG, JPG, GIF up to 5MB
              </p>

              <span className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors">
                Browse Files
              </span>

              {file && !error && (
                <p className="text-xs text-gray-500 mt-3">
                  {file.name} — {formatFileSize(file.size)}
                </p>
              )}
            </label>

            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="mx-auto max-h-30 w-auto rounded-lg object-contain mb-4"
              />
            ) : (
              ""
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
