import React, { useState, useEffect } from 'react';
import { LightbulbIcon, CloseIcon } from './Icons';

interface FeatureTooltipProps {
  featureId: string;
  title: string;
  description: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  featureId,
  title,
  description,
  children,
  position = 'bottom',
}) => {
  const storageKey = `spark-ai-academy-feature-seen-${featureId}`;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(storageKey);
    if (!hasSeen) {
      // Small delay to ensure the target element is painted and positioned correctly.
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const dismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
  };
  
  const positionClass = `pos-${position}`;

  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
        <div 
          className={`feature-tooltip animate-fade-in-up ${positionClass}`}
          role="tooltip"
        >
          <button 
            onClick={dismiss}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center">
                <LightbulbIcon className="w-4 h-4"/>
            </div>
            <div>
                <h3 className="font-bold text-lg text-white">{title}</h3>
                <p className="text-sm text-slate-300 mt-1">{description}</p>
            </div>
          </div>
          <div className="feature-tooltip-arrow" />
        </div>
    </div>
  );
};