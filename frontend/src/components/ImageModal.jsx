import React from 'react';

const ImageModal = ({ src, alt, onClose }) => {
  if (!src) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl max-h-full">
        <img src={src} alt={alt} className="max-w-full max-h-[80vh] rounded shadow-lg" />
      </div>
    </div>
  );
};

export default ImageModal;
