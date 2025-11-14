import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  size?: 'sm' | 'md';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'bg-indigo-500', size = 'md' }) => {
  const safeProgress = Math.max(0, Math.min(100, progress));
  const height = size === 'sm' ? 'h-2' : 'h-3';

  return (
    <div className={`w-full bg-slate-200 rounded-full ${height} overflow-hidden`}>
      <div
        className={`w-full ${height} rounded-full ${color} transition-transform duration-500 ease-out origin-left`}
        style={{ transform: `scaleX(${safeProgress / 100})` }}
      ></div>
    </div>
  );
};

export default ProgressBar;