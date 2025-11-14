import React, { useState, useLayoutEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

interface GuideProps {
  onFinish: () => void;
}

const guideSteps = [
  {
    targetId: 'learning-path',
    text: 'Welcome to your Learning Path! Here you can see all the fun courses to explore.',
    position: 'top',
  },
  {
    targetId: 'course-card-1',
    text: 'Click on any course card like this one to start your missions and earn stars!',
    position: 'bottom',
  },
  {
    targetId: 'profile-button',
    text: 'You can click here to change your name and pick a fun new avatar for your profile.',
    position: 'bottom',
  }
];

const Guide: React.FC<GuideProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const highlightRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const step = guideSteps[currentStep];
    const targetElement = document.querySelector<HTMLElement>(`[data-guide-id="${step.targetId}"]`);

    if (targetElement) {
        // Scroll element into view first
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
        });

        const calculateAndSetPosition = () => {
            // Re-query for the element in case of DOM changes during scroll/re-layout
            const currentTargetElement = document.querySelector<HTMLElement>(`[data-guide-id="${step.targetId}"]`);
            if (!currentTargetElement || !highlightRef.current || !tooltipRef.current) return;
            
            const targetRect = currentTargetElement.getBoundingClientRect();
            const tooltip = tooltipRef.current;
            const { offsetWidth: tooltipWidth, offsetHeight: tooltipHeight } = tooltip;
            const margin = 16;
            
            // Highlight positioning
            highlightRef.current.style.width = `${targetRect.width + 16}px`;
            highlightRef.current.style.height = `${targetRect.height + 16}px`;
            highlightRef.current.style.top = `${targetRect.top - 8}px`;
            highlightRef.current.style.left = `${targetRect.left - 8}px`;

            // Responsive Tooltip Positioning Logic
            let top, left;

            // Horizontal Positioning (center and clamp to viewport)
            left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
            left = Math.max(margin, left);
            left = Math.min(left, window.innerWidth - tooltipWidth - margin);
            
            // Vertical Positioning (prefer position, then flip, then clamp)
            const spaceBelow = window.innerHeight - targetRect.bottom;
            const spaceAbove = targetRect.top;
            const preferredPosition = step.position;

            if (preferredPosition === 'bottom') {
                if (spaceBelow > tooltipHeight + margin) {
                    top = targetRect.bottom + 10;
                } else {
                    top = targetRect.top - tooltipHeight - 10;
                }
            } else {
                if (spaceAbove > tooltipHeight + margin) {
                    top = targetRect.top - tooltipHeight - 10;
                } else {
                    top = targetRect.bottom + 10;
                }
            }

            // Final clamping to ensure tooltip is never off-screen
            top = Math.max(margin, top);
            top = Math.min(top, window.innerHeight - tooltipHeight - margin);

            setStyle({
                top: `${top}px`,
                left: `${left}px`,
                opacity: 1,
            });
        };

        // Delay calculation to allow smooth scroll to finish. 350ms is a safe bet for most browsers.
        const timer = setTimeout(calculateAndSetPosition, 350);

        return () => clearTimeout(timer);
    }
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      // Hide tooltip while transitioning to the next step for a smoother effect
      setStyle(prev => ({ ...prev, opacity: 0 }));
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="guide-overlay" onClick={handleNext}>
        <div 
            ref={highlightRef}
            className="guide-highlight"
        />
        <div 
            ref={tooltipRef}
            className="guide-tooltip"
            style={style}
            onClick={(e) => e.stopPropagation()}
        >
            <button onClick={onFinish} className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors" aria-label="Skip Guide">
                <CloseIcon className="w-5 h-5" />
            </button>
            <p className="text-slate-200 mb-4 pr-6">{guideSteps[currentStep].text}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">{currentStep + 1} / {guideSteps.length}</span>
                <button 
                    onClick={handleNext}
                    className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
                >
                    {currentStep === guideSteps.length - 1 ? 'Got it!' : 'Next'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default Guide;
