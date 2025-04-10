import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUpload, FiCrop, FiRotateCw, FiCamera, FiEye, FiRefreshCw, FiMove } from 'react-icons/fi';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const PhotoEditorModal = ({ isOpen, onClose, onSave, imageUrl }) => {
  const [step, setStep] = useState('edit'); // edit, crop
  const [crop, setCrop] = useState({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
  const [rotation, setRotation] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null); // null for free crop
  const [isDragging, setIsDragging] = useState(false);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [showGrid, setShowGrid] = useState(false);
  
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Basic crop presets
  const cropPresets = [
    { name: 'Free', value: null },
    { name: 'Square', value: 1 },
    { name: 'Landscape', value: 4/3 },
    { name: 'Portrait', value: 3/4 },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep('crop');
    }
  };

  const handleCropComplete = (crop, percentCrop) => {
    setCompletedCrop(crop);
  };

  const getCroppedImg = () => {
    if (!imageRef.current || !completedCrop) return null;
    
    const canvas = document.createElement('canvas');
    const image = imageRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    
    return canvas.toDataURL('image/jpeg');
  };

  const handleSave = async () => {
    if (!imageRef.current || !completedCrop) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a simple canvas to draw the cropped image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = imageRef.current;
      
      // Calculate scale factors
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      // Set canvas dimensions based on the crop
      const pixelCrop = {
        x: Math.round(completedCrop.x * scaleX),
        y: Math.round(completedCrop.y * scaleY),
        width: Math.round(completedCrop.width * scaleX),
        height: Math.round(completedCrop.height * scaleY)
      };
      
      // Set canvas size to match the crop size
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      
      // Draw the cropped portion of the image
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Pass the blob to the save callback
            onSave(blob)
              .then(() => {
                setTimeout(() => {
                  onClose();
                }, 1000);
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      console.error('Error processing image:', error);
      setIsLoading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep('crop');
    }
  };

  // Update window height on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate optimal image height based on window size
  const getMaxImageHeight = () => {
    const headerFooterHeight = 200;
    const padding = 32;
    return Math.min(500, windowHeight - headerFooterHeight - padding);
  };

  // Simple responsive check
  const isMobileScreen = window.innerWidth < 768;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-3xl overflow-hidden border border-white/20 shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Simple Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {step === 'edit' ? 'Select Image' : 'Crop & Rotate'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
            >
              <FiX className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 flex-grow overflow-y-auto">
          {step === 'edit' && (
            <div className="text-center h-full flex items-center justify-center">
              <div 
                className={`w-full max-w-xl mx-auto border-2 border-dashed rounded-2xl p-6 
                  transition-all duration-300 cursor-pointer 
                  bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm 
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-500/10 scale-105' 
                    : 'border-white/20 hover:border-blue-500/50'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FiCamera className="w-14 h-14 text-white/40 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">
                  {isDragging ? 'Drop image here' : 'Drop your image here'}
                </h4>
                <p className="text-white/60 mb-3 text-sm">
                  or click to browse from your computer
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}

          {step === 'crop' && (
            <div className="space-y-4">
              {/* Crop area */}
              <div className="relative rounded-xl overflow-hidden bg-black/50 p-2 sm:p-4 backdrop-blur-sm">
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-1 sm:p-2 ${showGrid ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'} rounded-full text-white backdrop-blur-sm`}
                    title="Toggle grid"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="3" y1="15" x2="21" y2="15"></line>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="15" y1="3" x2="15" y2="21"></line>
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setRotation(0);
                      setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
                      setAspectRatio(null);
                    }}
                    className="p-1 sm:p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm"
                    title="Reset"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center relative" style={{ 
                  height: `${getMaxImageHeight()}px`,
                  maxHeight: '100%'
                }}>
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3">
                      <div className="border-r border-b border-white/20"></div>
                      <div className="border-r border-l border-b border-white/20"></div>
                      <div className="border-l border-b border-white/20"></div>
                      <div className="border-r border-t border-b border-white/20"></div>
                      <div className="border border-white/20"></div>
                      <div className="border-l border-t border-b border-white/20"></div>
                      <div className="border-r border-t border-white/20"></div>
                      <div className="border-r border-l border-t border-white/20"></div>
                      <div className="border-l border-t border-white/20"></div>
                    </div>
                  )}
                  <ReactCrop
                    crop={crop}
                    onChange={setCrop}
                    onComplete={handleCropComplete}
                    aspect={aspectRatio}
                    className="crop-container max-w-full"
                    ruleOfThirds={true}
                  >
                    <img
                      ref={imageRef}
                      src={previewUrl}
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        maxHeight: `${getMaxImageHeight()}px`,
                        maxWidth: '100%',
                      }}
                      alt="To be cropped"
                    />
                  </ReactCrop>
                </div>
                <div className="absolute left-2 bottom-2 flex items-center backdrop-blur-md bg-black/40 rounded-lg px-2 py-1 text-white/70 text-xs">
                  <FiMove className="mr-1" /> 
                  <span>Drag to reposition</span>
                </div>
              </div>

              {/* Simple controls */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                {/* Crop presets */}
                <div className="mb-4">
                  <h4 className="text-white/80 text-xs font-medium mb-2">Aspect Ratio</h4>
                  <div className="flex flex-wrap gap-2">
                    {cropPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setAspectRatio(preset.value)}
                        className={`px-3 py-1.5 rounded-lg transition-all duration-200
                          ${aspectRatio === preset.value
                            ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rotation control */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-white/80 font-medium flex items-center gap-1">
                      <FiRotateCw className="w-3 h-3" /> Rotate
                    </label>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-md text-white/60">{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full appearance-none h-2 bg-white/10 rounded-full 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-white/10 bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-sm flex justify-between items-center">
          <button
            onClick={() => {
              if (step === 'crop') setStep('edit');
            }}
            className={`px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 ${step === 'edit' ? 'invisible' : ''}`}
          >
            Back
          </button>
          <button
            onClick={step === 'crop' ? handleSave : () => {}}
            disabled={isLoading || (step === 'crop' && !completedCrop)}
            className={`px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-all duration-200 ${(isLoading || (step === 'crop' && !completedCrop)) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiUpload className="w-4 h-4" />
                <span>{step === 'crop' ? 'Save Image' : ''}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add cache busting parameter to prevent image expiration
const addCacheBuster = (url) => {
  if (!url) return "/user.png";
  
  // If it's already a URL or a data URL, add a cache busting parameter
  if (url.startsWith('http') || url.startsWith('https') || url.startsWith('data:')) {
    // For data URLs, we don't need to modify them
    if (url.startsWith('data:')) return url;
    
    // Add timestamp as cache buster
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  }
  
  return url;
};

// Modify the default export to wrap the component and handle cache busting
const PhotoEditorModalWithNonExpiringImages = (props) => {
  // Apply cache busting to the imageUrl prop
  const modifiedProps = {
    ...props,
    imageUrl: addCacheBuster(props.imageUrl)
  };
  
  return <PhotoEditorModal {...modifiedProps} />;
};

export default PhotoEditorModalWithNonExpiringImages;