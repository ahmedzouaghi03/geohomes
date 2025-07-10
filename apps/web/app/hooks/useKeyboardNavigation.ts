"use client";

import { useEffect } from "react";

export const useKeyboardNavigation = (
  isActive: boolean,
  onNext: () => void,
  onPrev: () => void,
  onClose: () => void
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onNext, onPrev, onClose]);
};
