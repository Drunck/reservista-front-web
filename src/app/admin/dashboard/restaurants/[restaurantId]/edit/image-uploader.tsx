"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { filesArrayToFileList } from "@/lib/utils/file-array-to-file-list";
import Image from "next/image";
import { Trash2, Trash2Icon, UploadIcon, XIcon } from "lucide-react";

type PreviewImage = {
  id: string;
  src: string;
  file: File;
};

type ImageUploaderProps = {
  photos: FileList | null;
  setPhotos: (files: FileList | null) => void;
};

export default function ImageUploader({ photos, setPhotos }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [isInvalidFile, setIsInvalidFile] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: URL.createObjectURL(file),
      src: URL.createObjectURL(file),
      file,
    }));

    const invalidFiles = acceptedFiles.filter(
      (file) => !file.type.startsWith("image/")
    );

    setIsInvalidFile(invalidFiles.length > 0);

    setPreviews((prevImages) => [...prevImages, ...newImages]);
    setPhotos(filesArrayToFileList([...acceptedFiles]));
  }, [setPhotos]);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  const handleDeleteImage = (id: string) => {
    setPreviews((prevPriview) => prevPriview.filter((preview) => preview.id !== id));
    setPhotos(filesArrayToFileList(previews.filter((preview) => preview.id !== id).map((preview) => preview.file)));
  };


  return (
    <div className="w-full mt-10">
      <div className="w-full max-w-4xl mx-auto">
        <div {...getRootProps()}
          className={`border-2 border-dashed p-10 rounded-md cursor-pointer flex justify-center items-center
        ${isDragActive ? "bg-gray-100/70 border-black" : "border-gray-300"}`}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p className="flex gap-x-2 justify-center items-center"><UploadIcon className="w-5 h-5" /> Drop the images here ...</p> :
              <p className="flex gap-x-2 justify-center items-center"><UploadIcon className="w-5 h-5" /> Drag and drop images here, or click to select files</p>
          }
        </div>
      </div>
      {isInvalidFile && (
        <p className="text-red-500 text-center mt-2">
          Only image files are accepted
        </p>
      )}
      <div className="flex flex-wrap gap-4 mt-4">
        {previews.map((image) => (
          <div key={image.id} className="relative">
            <button
              type="button"
              onClick={() => handleDeleteImage(image.id)}
              className="absolute z-[1] -top-2 -right-2 bg-black border-2 border-white text-white rounded-full p-1 hover:bg-red-700 top"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
            <div key={image.id} className="relative w-32 h-32 rounded-md overflow-hidden">
              <Image
                key={image.id}
                src={image.src}
                alt="Preview"
                className="object-cover"
                fill
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
