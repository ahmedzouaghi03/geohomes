"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { addFavorite } from "@/actions/favouriteActions";

// Fix TypeScript declaration issue
declare module "react-modal";

interface WishlistModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  houseId: string;
}

// This will be set in a useEffect after component loads
const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onRequestClose,
  houseId,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Set app element when component mounts to avoid SSR issues
    Modal.setAppElement("body");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await addFavorite({ email, name, houseId });
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Failed to save to wishlist");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Wishlist Modal"
      className="wishlist-modal"
      overlayClassName="wishlist-overlay"
    >
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">Save to Wishlist</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {submitted ? (
          <div className="success-message">
            <p className="text-green-500 mb-4">
              Property saved to your wishlist!
            </p>
            <p className="mb-4">
              You can access your saved properties anytime using your email.
            </p>
            <button
              onClick={onRequestClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block mb-1">
                Name (optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Your name"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onRequestClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save to Wishlist"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default WishlistModal;
