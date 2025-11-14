
import React from 'react';
import { StarIcon, BadgeCheckIcon, RefreshIcon } from './Icons';

interface CertificateViewProps {
  userName: string;
  onReset: () => void;
}

const CertificateView: React.FC<CertificateViewProps> = ({ userName, onReset }) => {
  const achievementDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 p-4">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-yellow-300/50 rounded-full"></div>
        <div className="absolute -bottom-24 -left-12 w-64 h-64 bg-orange-300/50 rounded-full"></div>
        
        <div className="relative z-10">
            <BadgeCheckIcon className="w-24 h-24 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-600 mb-2">Certificate of Achievement</h1>
            <p className="text-slate-500 text-sm">This certifies that</p>
            <h2 className="text-5xl font-extrabold text-slate-800 my-4">{userName}</h2>
            <p className="text-slate-700 text-xl mb-6">has successfully completed all courses and is now an official</p>
            
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl px-8 py-3 mb-8">
                <span className="text-4xl font-bold">AI EXPERT</span>
            </div>
            
            <div className="flex justify-center items-center gap-2 text-amber-500 mb-6">
                <StarIcon className="w-8 h-8"/>
                <span className="text-2xl font-bold">1000 / 1000 Stars Achieved!</span>
                <StarIcon className="w-8 h-8"/>
            </div>
            
            <p className="text-slate-500 text-sm">Awarded on: {achievementDate}</p>

            <p className="text-slate-600 mt-6">Congratulations on your incredible journey of learning and discovery!</p>
            
            <button 
                onClick={onReset}
                className="mt-8 flex items-center justify-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
            >
                <RefreshIcon className="w-5 h-5" />
                <span>Start a New Adventure</span>
            </button>
        </div>
        <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-l from-yellow-400 to-orange-500"></div>
      </div>
    </div>
  );
};

export default CertificateView;
