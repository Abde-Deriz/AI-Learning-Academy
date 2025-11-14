import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { AVATAR_OPTIONS } from '../constants';
import { CloseIcon } from './Icons';

interface AvatarEditModalProps {
  onClose: () => void;
}

const AvatarEditModal: React.FC<AvatarEditModalProps> = ({ onClose }) => {
  const { user, updateUser } = useAppContext();
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || { icon: 'default' });

  useEffect(() => {
    setName(user?.name || '');
    setSelectedAvatar(user?.avatar || { icon: 'default' });
  }, [user]);

  const handleSave = () => {
    if (user && name.trim()) {
      updateUser({ name: name.trim(), avatar: selectedAvatar });
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full relative transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
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
          aria-label="Close"
        >
          <CloseIcon className="w-7 h-7" />
        </button>

        <h2 className="text-3xl font-extrabold text-slate-800 mb-6 text-center">Edit Your Profile</h2>
        
        <div className="mb-6">
          <label htmlFor="name-input" className="block text-lg font-bold text-slate-700 mb-2">Explorer Name</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-slate-300 rounded-lg shadow-inner focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-700 mb-3">Choose Your Avatar</h3>
          <div className="grid grid-cols-4 gap-4">
            {AVATAR_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => setSelectedAvatar({ icon: option.id })}
                className={`p-2 rounded-xl border-4 transition-all duration-200 ${
                  selectedAvatar.icon === option.id ? 'border-indigo-500 bg-indigo-100' : 'border-transparent hover:bg-slate-100'
                }`}
                aria-label={`Select ${option.name} avatar`}
              >
                <option.Icon className="w-full h-auto text-slate-700" />
                <span className="text-xs font-semibold mt-1 block">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xl py-3 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AvatarEditModal;