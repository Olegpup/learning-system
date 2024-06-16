import React, { useState } from 'react';
import { FileIcon } from '../../assets/icons/file';
import { TrashIcon } from '../../assets/icons/trash';

const FileUpload = ({ files, setFiles, filePreviews, setFilePreviews }) => {
  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);

    const indexedFiles = newFiles.map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      file,
    }));

    setFiles((prevFiles) => [...prevFiles, ...indexedFiles]);

    const newPreviews = indexedFiles.map(({ id, file }) => ({
      id,
      preview: URL.createObjectURL(file),
    }));

    setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const removeFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    setFilePreviews((prevPreviews) => prevPreviews.filter((preview) => preview.id !== id));
  };

  const handleFileChange = (event) => {
    handleFiles(event.target.files);
  };

  return (
    <div>
      <div
        className="w-full border-2 border-dashed border-gray-300 p-4 text-center rounded-lg relative flex justify-center items-center gap-3 
        text-gray-400 text-lg
        transition-all ease-in-out duration-200
        fill-gray-300
        hover:border-indigo-200 hover:text-indigo-400 hover:fill-indigo-300"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          multiple
          className="opacity-0 absolute inset-0 z-0 cursor-pointer"
          onChange={handleFileChange}
        />
        <FileIcon className={'w-10 h-10 '} />
        <p className="">Перетягніть файли сюди або натисніть, щоб вибрати</p>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {filePreviews.map((file) => (
          <div
            key={file.id}
            className="w-14 h-14 relative border border-gray-300 rounded-lg overflow-hidden cursor-pointer
            hover:border-red-400"
            onClick={() => removeFile(file.id)}
          >
            <div
              className="w-full h-full absolute right-0 top-0 bg-red-500 flex justify-center items-center opacity-0
              transition-color duration-200 ease-in-out
              hover:opacity-100"
            >
              <TrashIcon className={'stroke-white w-7 h-7'} />
            </div>
            <img src={file.preview} alt="file preview" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
