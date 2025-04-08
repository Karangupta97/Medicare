import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUpload, FiCrop, FiRotateCw, FiSearch, FiTrash, FiImage, FiMaximize2, FiMinimize2, FiDownload, FiCamera, FiFilter, FiSun, FiCheckCircle, FiEye, FiRefreshCw, FiMove, FiArrowLeft } from 'react-icons/fi';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const PhotoEditorModal = ({ isOpen, onClose, onSave, imageUrl }) => {
  const [step, setStep] = useState('edit'); // edit, crop, preview
  const [crop, setCrop] = useState({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [filters, setFilters] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [previewMode, setPreviewMode] = useState('after'); // 'after', 'before', 'split'
  const [cropTab, setCropTab] = useState('crop'); // 'crop', 'adjust', 'filters'
  const [completedCrop, setCompletedCrop] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  const aspectRatios = [
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4/3 },
    { label: '16:9', value: 16/9 },
    { label: 'Free', value: null }
  ];

  const filterOptions = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(100%)' },
    { name: 'Invert', value: 'invert(100%)' },
    { name: 'Blur', value: 'blur(2px)' },
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

  const getRadianAngle = (degreeValue) => {
    return (degreeValue * Math.PI) / 180;
  };

  const handleSave = async () => {
    console.log('Save button clicked', { completedCrop, imageRef: !!imageRef.current });
    
    if (!imageRef.current || !completedCrop) {
      console.error('Missing required data for save', { imageRef: !!imageRef.current, completedCrop });
      setToast({
        show: true,
        message: 'No crop area selected. Please crop the image first.',
        type: 'error'
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
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
      
      console.log('Crop dimensions:', pixelCrop);
      console.log('Image dimensions:', { 
        natural: { width: image.naturalWidth, height: image.naturalHeight },
        display: { width: image.width, height: image.height }
      });
      
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
            console.log('Blob created successfully', { size: blob.size });
            
            // Pass the blob to the save callback
            onSave(blob)
              .then(() => {
                console.log('Image saved successfully');
                setToast({
                  show: true,
                  message: 'Image saved successfully!',
                  type: 'success'
                });
                setTimeout(() => {
                  setToast({ show: false, message: '', type: '' });
                  onClose();
                }, 1500);
              })
              .catch(error => {
                console.error('Error saving image:', error);
                setToast({
                  show: true,
                  message: 'Failed to save image. Please try again.',
                  type: 'error'
                });
                setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
                setIsLoading(false);
              });
          } else {
            console.error('Failed to create blob from canvas');
            setToast({
              show: true,
              message: 'Failed to process image. Please try again.',
              type: 'error'
            });
            setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
            setIsLoading(false);
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      console.error('Error processing image:', error);
      setToast({
        show: true,
        message: 'Failed to save image. Please try again.',
        type: 'error'
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      setIsLoading(false);
    }
  };
  
  // Add this simple fallback save function for testing
  const handleFallbackSave = () => {
    setIsLoading(true);
    
    try {
      // Convert the original image to a blob without cropping
      fetch(previewUrl)
        .then(res => res.blob())
        .then(blob => {
          onSave(blob)
            .then(() => {
              setToast({
                show: true,
                message: 'Image saved successfully!',
                type: 'success'
              });
              setTimeout(() => {
                setToast({ show: false, message: '', type: '' });
                onClose();
              }, 1500);
            })
            .catch(error => {
              console.error('Error saving image:', error);
              setToast({
                show: true,
                message: 'Failed to save image. Please try again.',
                type: 'error'
              });
              setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
            })
            .finally(() => {
              setIsLoading(false);
            });
        })
        .catch(error => {
          console.error('Error fetching image as blob:', error);
          setToast({
            show: true,
            message: 'Failed to process image. Please try again.',
            type: 'error'
          });
          setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Error in fallback save:', error);
      setToast({
        show: true,
        message: 'Failed to save image. Please try again.',
        type: 'error'
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && step === 'crop') handleSave();
      // Add other shortcuts as needed
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step]);

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

  // Calculate optimal image height based on window size and UI elements
  const getMaxImageHeight = () => {
    // Consider different screen sizes and UI elements height
    const headerFooterHeight = 280; // Approx pixels for header + footer + padding
    const controlsHeight = 300; // Approx height for controls section
    const padding = 32; // Additional padding
    const smallScreen = windowHeight < 700;
    const mediumScreen = windowHeight >= 700 && windowHeight < 900;

    if (smallScreen) {
      return Math.min(300, windowHeight - headerFooterHeight - padding);
    } else if (mediumScreen) {
      return Math.min(400, windowHeight - headerFooterHeight - padding);
    } else {
      return Math.min(500, windowHeight - headerFooterHeight - padding);
    }
  };

  // Adjust UI based on screen size
  const isSmallScreen = windowHeight < 700 || window.innerWidth < 640;
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
        className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl w-full max-w-5xl overflow-hidden border border-white/20 shadow-2xl my-2 sm:my-4"
        onClick={e => e.stopPropagation()}
        style={{
          maxHeight: isSmallScreen ? '95vh' : '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header with enhanced steps */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {(step !== 'edit' && isMobileScreen) && (
                  <button
                    onClick={() => {
                      if (step === 'preview') setStep('crop');
                      else if (step === 'crop') setStep('edit');
                    }}
                    className="p-1 hover:bg-white/10 rounded-full transition-all duration-200 text-white/60"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {step === 'edit' ? 'Select Image' : step === 'crop' ? 'Adjust Image' : 'Preview'}
                </h3>
              </div>
              <p className="text-white/60 mt-1 text-sm sm:text-base">
                {step === 'edit' 
                  ? 'Choose a photo to get started' 
                  : step === 'crop' 
                  ? 'Make adjustments to your photo'
                  : 'Review your changes'}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {step === 'crop' && !isSmallScreen && (
                <button
                  onClick={() => setIsComplete(!isComplete)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                  title="Complete editing"
                >
                  <FiCheckCircle className={`w-5 sm:w-6 h-5 sm:h-6 ${isComplete ? 'text-green-400' : 'text-white/60'}`} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <FiX className="w-5 sm:w-6 h-5 sm:h-6 text-white/80" />
              </button>
            </div>
          </div>

          {/* Enhanced progress indicator - hide on very small screens */}
          {!isSmallScreen && (
            <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
              {['edit', 'crop', 'preview'].map((s, i) => (
                <React.Fragment key={s}>
                  <motion.div 
                    className="flex items-center gap-2 sm:gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => i < ['edit', 'crop', 'preview'].indexOf(step) && setStep(s)}
                  >
                    <motion.div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 cursor-pointer
                      ${s === step 
                        ? 'border-blue-500 bg-blue-500/20 text-blue-500' 
                        : i < ['edit', 'crop', 'preview'].indexOf(step) 
                        ? 'border-green-500 bg-green-500/20 text-green-500'
                        : 'border-white/20 text-white/40'}
                    `}
                    animate={{ scale: s === step ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                    >
                      {i + 1}
                    </motion.div>
                    <span className={`text-xs sm:text-sm font-medium ${
                      s === step ? 'text-blue-500' : 
                      i < ['edit', 'crop', 'preview'].indexOf(step) ? 'text-green-500' : 'text-white/40'
                    }`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  </motion.div>
                  {i < 2 && (
                    <div className={`flex-1 h-0.5 ${
                      i < ['edit', 'crop', 'preview'].indexOf(step) 
                        ? 'bg-green-500' 
                        : 'bg-white/10'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Main Content with enhanced interactions - use flex-grow for dynamic height */}
        <div className="p-4 sm:p-6 md:p-8 flex-grow overflow-y-auto">
          {step === 'edit' && (
            <div className="text-center h-full flex items-center justify-center">
              <div 
                className={`w-full max-w-xl mx-auto border-2 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-12 
                  transition-all duration-300 cursor-pointer 
                  bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm 
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-500/10 scale-105' 
                    : 'border-white/20 hover:border-blue-500/50 group'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <motion.div 
                  className="transform group-hover:scale-110 transition-transform duration-300"
                  animate={{ y: isDragging ? [0, -10, 0] : 0 }}
                  transition={{ repeat: isDragging ? Infinity : 0, duration: 1.5 }}
                >
                  <FiCamera className="w-14 h-14 sm:w-20 sm:h-20 text-white/40 mx-auto mb-4 sm:mb-6" />
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                    {isDragging ? 'Drop image here' : 'Drop your image here'}
                  </h4>
                  <p className="text-white/60 mb-3 sm:mb-4 text-sm sm:text-base">
                    or click to browse from your computer
                  </p>
                  <div className="flex justify-center gap-2 text-white/40 text-xs sm:text-sm mb-3 sm:mb-4">
                    <span className="px-2 py-1 bg-white/5 rounded-lg">JPG</span>
                    <span className="px-2 py-1 bg-white/5 rounded-lg">PNG</span>
                    <span className="px-2 py-1 bg-white/5 rounded-lg">WEBP</span>
                  </div>
                  <p className="text-white/40 text-xs">
                    Max size: 5MB
                  </p>
                </motion.div>
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
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black/50 p-2 sm:p-4 md:p-6 backdrop-blur-sm">
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 z-10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setStep('preview')}
                    className="p-1 sm:p-2 bg-blue-500/80 hover:bg-blue-500 rounded-full text-white backdrop-blur-sm"
                    title="Preview result"
                  >
                    <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setRotation(0);
                      setZoom(1);
                      setBrightness(100);
                      setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
                    }}
                    className="p-1 sm:p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm"
                    title="Reset all changes"
                  >
                    <FiRefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
                <div className="flex items-center justify-center" style={{ 
                  height: `${getMaxImageHeight()}px`,
                  maxHeight: '100%'
                }}>
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
                        transform: `rotate(${rotation}deg) scale(${zoom})`,
                        filter: `brightness(${brightness}%) ${filters}`,
                        maxHeight: `${getMaxImageHeight()}px`,
                        maxWidth: '100%',
                        transition: 'filter 0.3s ease'
                      }}
                      alt="To be cropped"
                    />
                  </ReactCrop>
                </div>
                <div className="absolute left-2 sm:left-4 bottom-2 sm:bottom-4 flex items-center backdrop-blur-md bg-black/40 rounded-lg sm:rounded-xl px-2 py-1 sm:px-3 sm:py-2 text-white/70 text-xs sm:text-sm">
                  <FiMove className="mr-1 sm:mr-2" /> 
                  <span className="hidden xs:inline">Drag to reposition • Handles to resize</span>
                  <span className="xs:hidden">Drag to adjust</span>
                </div>
              </div>

              {/* Enhanced Controls Panel - simplified for mobile */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6">
                {/* Tabs for different adjustments */}
                <div className="flex mb-4 sm:mb-6 border-b border-white/10 pb-2 gap-2 overflow-x-auto scrollbar-hide">
                  <button 
                    onClick={() => setCropTab('crop')}
                    className={`px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 transition-all duration-200 rounded-t-lg whitespace-nowrap ${
                      cropTab === 'crop' 
                        ? 'text-blue-400 border-b-2 border-blue-500 bg-white/5' 
                        : 'text-white/60 hover:text-white/90'
                    }`}
                  >
                    <FiCrop className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Crop</span>
                  </button>
                  <button 
                    onClick={() => setCropTab('adjust')}
                    className={`px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 transition-all duration-200 rounded-t-lg whitespace-nowrap ${
                      cropTab === 'adjust' 
                        ? 'text-blue-400 border-b-2 border-blue-500 bg-white/5' 
                        : 'text-white/60 hover:text-white/90'
                    }`}
                  >
                    <FiRotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Adjust</span>
                  </button>
                  <button 
                    onClick={() => setCropTab('filters')}
                    className={`px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 transition-all duration-200 rounded-t-lg whitespace-nowrap ${
                      cropTab === 'filters' 
                        ? 'text-blue-400 border-b-2 border-blue-500 bg-white/5' 
                        : 'text-white/60 hover:text-white/90'
                    }`}
                  >
                    <FiFilter className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Filters</span>
                  </button>
                </div>

                {cropTab === 'crop' && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="text-white/80 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Aspect Ratio</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {aspectRatios.map((ratio) => (
                          <motion.button
                            key={ratio.label}
                            onClick={() => setAspectRatio(ratio.value)}
                            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex flex-col items-center ${
                              aspectRatio === ratio.value
                                ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                          >
                            <div className={`w-8 h-6 sm:w-12 sm:h-8 mb-1 sm:mb-2 border-2 rounded flex items-center justify-center ${
                              aspectRatio === ratio.value ? 'border-blue-400' : 'border-white/40'
                            }`} style={{
                              aspectRatio: ratio.value || 1.5
                            }}>
                              {ratio.label === 'Free' && <FiMaximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                            </div>
                            <span className="text-2xs sm:text-xs">{ratio.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {cropTab === 'adjust' && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="flex justify-between mb-1 sm:mb-2">
                        <label className="text-xs sm:text-sm text-white/80 font-medium flex items-center gap-1">
                          <FiMaximize2 className="w-3 h-3 sm:w-4 sm:h-4" /> Zoom
                        </label>
                        <span className="text-2xs sm:text-xs bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-white/60">{zoom}x</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMinimize2 className="text-white/40 w-3 h-3 sm:w-4 sm:h-4" />
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.1"
                          value={zoom}
                          onChange={(e) => setZoom(e.target.value)}
                          className="w-full appearance-none h-1.5 sm:h-2 bg-white/10 rounded-full 
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:sm:w-5 [&::-webkit-slider-thumb]:sm:h-5 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 hover:[&::-webkit-slider-thumb]:bg-blue-400
                            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                        />
                        <FiMaximize2 className="text-white/40 w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 sm:mb-2">
                        <label className="text-xs sm:text-sm text-white/80 font-medium flex items-center gap-1">
                          <FiRotateCw className="w-3 h-3 sm:w-4 sm:h-4" /> Rotate
                        </label>
                        <span className="text-2xs sm:text-xs bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-white/60">{rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={(e) => setRotation(e.target.value)}
                        className="w-full appearance-none h-1.5 sm:h-2 bg-white/10 rounded-full 
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:sm:w-5 [&::-webkit-slider-thumb]:sm:h-5 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 hover:[&::-webkit-slider-thumb]:bg-blue-400
                          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 sm:mb-2">
                        <label className="text-xs sm:text-sm text-white/80 font-medium flex items-center gap-1">
                          <FiSun className="w-3 h-3 sm:w-4 sm:h-4" /> Brightness
                        </label>
                        <span className="text-2xs sm:text-xs bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-white/60">{brightness}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiSun className="text-white/40 w-3 h-3 sm:w-4 sm:h-4" />
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={brightness}
                          onChange={(e) => setBrightness(e.target.value)}
                          className="w-full appearance-none h-1.5 sm:h-2 bg-white/10 rounded-full 
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:sm:w-5 [&::-webkit-slider-thumb]:sm:h-5 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 hover:[&::-webkit-slider-thumb]:bg-blue-400
                            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                        />
                        <FiSun className="text-white/80 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  </div>
                )}

                {cropTab === 'filters' && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="text-white/80 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Filters</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                        {filterOptions.map((filter) => (
                          <motion.button
                            key={filter.name}
                            onClick={() => setFilters(filter.value)}
                            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex flex-col items-center ${
                              filters === filter.value
                                ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                          >
                            <div className={`w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2 overflow-hidden rounded ${
                              filters === filter.value ? 'ring-2 ring-blue-400' : ''
                            }`}>
                              {previewUrl && (
                                <img 
                                  src={previewUrl} 
                                  className="w-full h-full object-cover" 
                                  style={{ filter: filter.value }}
                                  alt={filter.name}
                                />
                              )}
                            </div>
                            <span className="text-2xs sm:text-xs">{filter.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <button 
                  onClick={() => setPreviewMode('after')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base ${previewMode === 'after' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60'}`}
                >
                  After
                </button>
                <button 
                  onClick={() => setPreviewMode('before')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base ${previewMode === 'before' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60'}`}
                >
                  Before
                </button>
                <button 
                  onClick={() => setPreviewMode('split')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base ${previewMode === 'split' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60'}`}
                >
                  Split
                </button>
              </div>
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm flex justify-center items-center" 
                style={{ height: `${getMaxImageHeight()}px` }}
              >
                {previewMode === 'after' && (
                  <img
                    src={getCroppedImg() || previewUrl}
                    className="max-h-full max-w-full object-contain"
                    style={{
                      filter: `brightness(${brightness}%) ${filters}`
                    }}
                    alt="Edited preview"
                  />
                )}

                {previewMode === 'before' && (
                  <img
                    src={previewUrl}
                    className="max-h-full max-w-full object-contain"
                    alt="Original image"
                  />
                )}
                
                {previewMode === 'split' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={previewUrl}
                        className="max-h-full max-w-full object-contain"
                        alt="Original image"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ clipPath: `polygon(0 0, 50% 0, 50% 100%, 0 100%)` }}>
                      <img
                        src={getCroppedImg() || previewUrl}
                        className="max-h-full max-w-full object-contain"
                        style={{
                          filter: `brightness(${brightness}%) ${filters}`
                        }}
                        alt="Edited preview"
                      />
                    </div>
                    <div className="absolute inset-y-0 left-1/2 w-1 bg-white/80 transform -translate-x-1/2 z-10"></div>
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/60 text-white/80 text-2xs sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded backdrop-blur-sm">
                      Before
                    </div>
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/60 text-white/80 text-2xs sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded backdrop-blur-sm">
                      After
                    </div>
                  </div>
                )}
              </div>

              {/* Simplified details for mobile */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg text-white/80 font-medium">Image Details</h3>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="bg-white/5 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                      <div className="text-xs sm:text-sm text-white/60 mb-0.5 sm:mb-1">Format</div>
                      <div className="text-sm sm:text-base text-white font-medium">JPG</div>
                    </div>
                    
                    <div className="bg-white/5 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                      <div className="text-xs sm:text-sm text-white/60 mb-0.5 sm:mb-1">Dimensions</div>
                      <div className="text-sm sm:text-base text-white font-medium">
                        {completedCrop ? `${Math.round(completedCrop.width)} × ${Math.round(completedCrop.height)}` : 'Original'}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                      <div className="text-xs sm:text-sm text-white/60 mb-0.5 sm:mb-1">Rotation</div>
                      <div className="text-sm sm:text-base text-white font-medium">{rotation}°</div>
                    </div>

                    <div className="bg-white/5 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                      <div className="text-xs sm:text-sm text-white/60 mb-0.5 sm:mb-1">Filters</div>
                      <div className="text-sm sm:text-base text-white font-medium capitalize">{filters === 'none' ? 'None' : filters.split('(')[0]}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer - simplified for mobile */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-white/10 bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-sm flex justify-between items-center">
          {!isMobileScreen && (
            <button
              onClick={() => {
                if (step === 'preview') setStep('crop');
                else if (step === 'crop') setStep('edit');
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base"
            >
              Back
            </button>
          )}
          {isMobileScreen && <div></div>}
          <div className="flex gap-2 sm:gap-3">
            {step === 'crop' && !isMobileScreen && (
              <button
                onClick={() => {
                  // Reset values
                  setRotation(0);
                  setZoom(1);
                  setBrightness(100);
                  setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
                  setFilters('none');
                }}
                className="px-3 sm:px-4 py-2 sm:py-3 text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base"
              >
                Reset
              </button>
            )}
            <motion.button
              onClick={step === 'preview' ? handleSave : () => setStep(step === 'crop' ? 'preview' : 'crop')}
              disabled={isLoading || (step === 'preview' && !completedCrop)}
              className={`px-4 sm:px-8 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 transition-all duration-200 ${(isLoading || (step === 'preview' && !completedCrop)) ? 'opacity-50 cursor-not-allowed' : ''} text-sm sm:text-base`}
              whileHover={{ scale: isLoading ? 1 : 1.03 }}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
            >
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {step === 'preview' ? <FiUpload className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <FiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  <span>{step === 'preview' ? 'Save Changes' : 'Preview'}</span>
                </>
              )}
            </motion.button>
            {step === 'preview' && (
              <button
                onClick={handleFallbackSave}
                className="px-3 sm:px-4 py-2 sm:py-3 text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base"
              >
                Save Fallback
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PhotoEditorModal;
