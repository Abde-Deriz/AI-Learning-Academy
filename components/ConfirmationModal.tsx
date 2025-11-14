import React from 'react';
import { CloseIcon, QuestionMarkCircleIcon } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirmation-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full relative transform transition-all duration-300 scale-95 opacity-0 animate-scale-in text-center">
        <style>{`
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
          }
        `}</style>
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors p-1 rounded-full"
          aria-label="Close dialog"
        >
          <CloseIcon className="w-7 h-7" />
        </button>
        
        <QuestionMarkCircleIcon className="w-16 h-16 text-amber-500 mx-auto mb-4" />

        <h2 id="confirmation-title" className="text-2xl font-extrabold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600 mb-8">{message}</p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-full hover:bg-slate-300 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-red-500 text-white font-bold py-3 rounded-full hover:bg-red-600 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;