import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Badge } from '../types';

const BadgeItem: React.FC<{ badge: Badge }> = ({ badge }) => (
    <div className="relative group flex flex-col items-center cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110">
            <badge.Icon className="w-9 h-9 text-white" />
        </div>
        <p className="text-xs font-semibold text-slate-600 mt-2 text-center truncate w-full">{badge.name}</p>
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 w-48 bg-slate-800 text-white text-xs rounded-lg p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            <p className="font-bold text-base">{badge.name}</p>
            <p className="mt-1">{badge.description}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-slate-800"></div>
        </div>
    </div>
);

const BadgesDisplay: React.FC = () => {
    const { earnedBadges } = useAppContext();

    if (!earnedBadges || earnedBadges.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 my-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-bold text-slate-700 mb-4">Your Achievements</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-4 gap-x-2">
                {earnedBadges.map(badge => (
                    <BadgeItem key={badge.id} badge={badge} />
                ))}
            </div>
        </div>
    );
};

export default BadgesDisplay;