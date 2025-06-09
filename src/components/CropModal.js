import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";

const CropModal = ({ open, onClose, imageSrc, onCropComplete, darkMode }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteCallback = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg max-w-md w-full mx-4`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Crop Image
        </h3>

        <div className="relative w-full h-64 mb-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
          />
        </div>

        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Zoom
          </label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-700"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
