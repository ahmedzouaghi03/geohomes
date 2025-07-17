"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

interface ImageGalleryProps {
  images: string[];
  houseTitle: string;
}

export default function ImageGallery({
  images,
  houseTitle,
}: ImageGalleryProps) {
  const [showVerticalSlider, setShowVerticalSlider] = useState(false);
  const [showHorizontalCarousel, setShowHorizontalCarousel] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openVerticalSlider = (index: number) => {
    setSelectedImageIndex(index);
    setShowVerticalSlider(true);
  };

  const openHorizontalCarousel = (index: number) => {
    setSelectedImageIndex(index);
    setShowHorizontalCarousel(true);
  };

  const closeAll = () => {
    setShowVerticalSlider(false);
    setShowHorizontalCarousel(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  useKeyboardNavigation(showHorizontalCarousel, nextImage, prevImage, closeAll);
  return (
    <>
      {/* Main Gallery Grid */}
      <div className="md:col-span-2">
        <div
          className="relative w-full h-80 rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => openVerticalSlider(0)}
        >
          <Image
            src={images[0]}
            alt={houseTitle}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-lg font-medium">
              Voir toutes les photos
            </span>
          </div>
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.slice(1, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative w-full h-24 rounded overflow-hidden cursor-pointer group"
                onClick={() => openVerticalSlider(idx + 1)}
              >
                <Image
                  src={img}
                  alt={`${houseTitle} image ${idx + 2}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {idx === 2 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-bold">
                    +{images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vertical Slider Modal */}
      {showVerticalSlider && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-6xl mx-auto p-4">
            {/* Close Button */}
            <button
              onClick={closeAll}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>

            {/* Vertical Slider Content */}
            <div className="h-full overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square cursor-pointer group"
                    onClick={() => {
                      setShowVerticalSlider(false);
                      openHorizontalCarousel(index);
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${houseTitle} image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        Voir en grand
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Carousel Modal */}
      {showHorizontalCarousel && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Close Button */}
            <button
              onClick={closeAll}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 text-white text-sm bg-black/50 px-3 py-1 rounded">
              {selectedImageIndex + 1} / {images.length}
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
                <Image
                  src={images[selectedImageIndex]}
                  alt={`${houseTitle} image ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Thumbnail Strip (hidden on mobile) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block">
              <div className="flex gap-2 bg-black/50 p-2 rounded-lg max-w-md overflow-x-auto">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative w-16 h-16 rounded cursor-pointer transition-all ${
                      index === selectedImageIndex
                        ? "ring-2 ring-white"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
