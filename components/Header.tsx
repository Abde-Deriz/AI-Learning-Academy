import React, { useState, useMemo } from 'react';
import { StarIcon, LogoutIcon, FireIcon } from './Icons';
import { useAppContext } from '../context/AppContext';
import ProgressBar from './ProgressBar';
import Avatar from './Avatar';
import AvatarEditModal from './AvatarCustomizer';
import ConfirmationModal from './ConfirmationModal';

const Header: React.FC = () => {
  const { user, totalStars, logout, streak, courses, navigate } = useAppContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const totalPossibleStars = useMemo(() => {
    return courses.reduce((total, course) => {
      return total + course.lessons.reduce((courseTotal, lesson) => courseTotal + lesson.starsAwarded, 0);
    }, 0);
  }, [courses]);

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutConfirmOpen(false);
  };

  const handleAuthClick = (e: React.MouseEvent<HTMLButtonElement>, view: 'login' | 'signup') => {
    e.preventDefault();
    navigate(`/${view}`);
  }

  if (!user) {
    return (
       <header className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in-down">
        <div>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-2xl font-bold text-slate-800 hover:text-indigo-600 transition">Welcome to Spark AI Academy!</a>
          <p className="text-slate-500">Preview the courses below or sign up to save your progress.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button onClick={(e) => handleAuthClick(e, 'login')} className="w-full sm:w-auto bg-indigo-100 text-indigo-700 font-bold py-2 px-6 rounded-full hover:bg-indigo-200 transition">
            Login
          </button>
          <button onClick={(e) => handleAuthClick(e, 'signup')} className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700 transition">
            Sign Up
          </button>
        </div>
       </header>
    )
  }

  return (
    <>
      <header className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in-down">
        {/* Top row with icons */}
        <div className="flex justify-between items-start">
          {/* Left Side: Avatar and Desktop Welcome Text */}
          <div className="flex items-center gap-3">
            <button data-guide-id="profile-button" onClick={() => setIsEditModalOpen(true)} className="rounded-full hover:ring-4 hover:ring-indigo-300 transition-all duration-200 flex-shrink-0" aria-label="Edit your profile">
              <Avatar avatar={user.avatar} className="w-12 h-12 sm:w-16 sm:h-16" />
            </button>
            <div className="hidden sm:block">
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-2xl font-bold text-slate-800 hover:text-indigo-600 transition">
                Welcome, <span className="text-indigo-600">{user?.name}!</span>
              </a>
              <p className="text-slate-500 text-sm">Let's learn something new today!</p>
            </div>
          </div>
          
          {/* Right Side: Icons */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            {streak > 0 && (
              <div
                className="flex items-center gap-1 sm:gap-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 animate-streak-glow"
                title={`${streak} Day Streak! Keep it up!`}
              >
                <FireIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg">{streak}</span>
              </div>
            )}
            <button 
              onClick={() => setIsLogoutConfirmOpen(true)}
              className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold p-2.5 sm:py-2 sm:px-4 rounded-full transition-colors duration-300"
              aria-label="Logout"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="hidden sm:inline sm:ml-2">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Mobile-only Welcome Text */}
        <div className="sm:hidden mt-4">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition">
            Welcome, <span className="text-indigo-600">{user?.name}!</span>
          </a>
          <p className="text-slate-500 text-sm">Let's learn something new today!</p>
        </div>
        
        {/* Progress Bar (all screens) */}
        <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="text-slate-600">Journey to AI Expert</span>
                <span className="text-amber-600 flex items-center gap-1">
                    <StarIcon className="w-4 h-4" /> {totalStars} / {totalPossibleStars}
                </span>
            </div>
            <ProgressBar progress={(totalStars / totalPossibleStars) * 100} color="bg-gradient-to-r from-amber-400 to-orange-500" />
        </div>
      </header>
      {isEditModalOpen && <AvatarEditModal onClose={() => setIsEditModalOpen(false)} />}
      <ConfirmationModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Log Out?"
        message="Are you sure you want to end your adventure? Your progress will be saved for next time!"
        confirmText="Log Out"
        cancelText="Stay"
      />
    </>
  );
};

export default Header;