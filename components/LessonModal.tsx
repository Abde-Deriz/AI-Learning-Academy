
import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';
import { StarIcon, CloseIcon, ArrowRightIcon } from './Icons';
import MissionView from './MissionView';
import { useAppContext } from '../context/AppContext';
import { soundService } from '../services/soundService';
import { hapticService } from '../services/hapticService';

interface LessonModalProps {
  lesson: Lesson;
  courseTopic: string;
  reviewMode: boolean;
  onComplete: (isManualOverride?: boolean) => void;
  onClose: () => void;
  onNavigateNext: () => void;
  hasNextLesson: boolean;
}

const CelebrationAnimation: React.FC = () => {
    return (
        <div className="sparkle-container">
            {Array.from({ length: 15 }).map((_, i) => {
                const angle = (i / 15) * 360 + Math.random() * 20 - 10;
                const radius = Math.random() * 60 + 50;
                const x = Math.cos(angle * (Math.PI / 180)) * radius;
                const y = Math.sin(angle * (Math.PI / 180)) * radius;
                const colors = ['#fcd34d', '#f87171', '#4ade80', '#60a5fa'];
                return (
                    <div
                        key={i}
                        className="sparkle"
                        style={{
                            '--tx': `${x}px`,
                            '--ty': `${y}px`,
                            background: colors[i % colors.length],
                            animationDelay: `${Math.random() * 0.3}s`,
                        } as React.CSSProperties}
                    />
                );
            })}
        </div>
    );
};

const LessonModal: React.FC<LessonModalProps> = ({ lesson, courseTopic, reviewMode, onComplete, onClose, onNavigateNext, hasNextLesson }) => {
  const { user, openAuthModal } = useAppContext();
  const isInfoMission = lesson.missionType === 'info';
  const [isSolved, setIsSolved] = useState(reviewMode || isInfoMission);
  const [isJustCompleted, setIsJustCompleted] = useState(false);

  // Reset state when lesson changes
  useEffect(() => {
    setIsSolved(reviewMode || lesson.missionType === 'info');
    setIsJustCompleted(false);
  }, [lesson, reviewMode]);

  const handleComplete = () => {
    if (!isSolved && !isInfoMission) return;
    if (!user) {
      openAuthModal('signup');
      return;
    }
    soundService.playComplete();
    hapticService.success();
    onComplete();
    if (!reviewMode) {
      setIsJustCompleted(true);
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isMissionDone = isJustCompleted || reviewMode;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      aria-labelledby="lesson-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full relative transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <style>{`
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
          }
          @keyframes pop-in {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in {
            animation: pop-in 0.4s ease-out forwards;
          }
        `}</style>
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors p-1 rounded-full"
          aria-label="Close lesson"
        >
          <CloseIcon className="w-7 h-7" />
        </button>
        
        <h2 id="lesson-title" className="text-3xl font-extrabold text-slate-800 mb-4 pr-8">{lesson.title}</h2>
        
        <div className="my-6 min-h-[150px]">
          <MissionView 
            missionType={lesson.missionType} 
            missionData={lesson.missionData}
            onSolve={() => setIsSolved(true)}
            reviewMode={reviewMode}
          />
        </div>
        
        {isMissionDone ? (
            <div className="mt-6">
                {isJustCompleted && (
                    <div className="text-center relative mb-6">
                        <CelebrationAnimation />
                        <h3 className="text-2xl font-bold text-green-600 animate-pop-in">Mission Complete!</h3>
                        <p className="text-slate-500 mt-1">You earned {lesson.starsAwarded} stars!</p>
                    </div>
                )}
                <div className="flex items-center gap-4">
                     <button
                        onClick={onClose}
                        className="bg-slate-200 text-slate-800 font-bold p-3 rounded-full hover:bg-slate-300 transition-colors"
                        aria-label="Close"
                      >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                    {hasNextLesson ? (
                        <button
                            onClick={onNavigateNext}
                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-full hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg hover:scale-105 transform duration-300"
                        >
                            <span>Next Mission</span>
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    ) : (
                         <button
                            onClick={onClose}
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-full hover:bg-green-700 transition"
                        >
                            Finish Course!
                        </button>
                    )}
                </div>
            </div>
        ) : (
          isSolved && !user ? (
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xl py-4 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
            >
              Sign Up to Save Progress!
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!isInfoMission && !isSolved}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl py-4 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>{isInfoMission ? 'Got It!' : 'Complete Mission!'}</span>
              <span className="flex items-center justify-center bg-white/30 rounded-full px-3 py-1 text-sm">
                  +{lesson.starsAwarded} <StarIcon className="w-4 h-4 ml-1 text-yellow-300"/>
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default LessonModal;
