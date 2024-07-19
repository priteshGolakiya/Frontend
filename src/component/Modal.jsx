/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };
  
  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 overflow-y-auto scrollbar-hidden bg-black bg-opacity-50 flex justify-center items-start ${
            isAnimating ? "fade-in" : "fade-out"
          }`}
        >
          <div className="bg-white p-8 rounded-lg max-w-md mx-4 my-8 sm:mx-6 sm:my-4 mt-20 transform transition-transform duration-300">
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={handleClose}
              >
                <i className="fa-solid fa-x text-lg"></i>
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
