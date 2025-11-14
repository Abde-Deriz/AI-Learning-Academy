import React from 'react';
import { RobotIcon } from './Icons';

const GuestHero: React.FC = () => {
  return (
    <div className="text-center bg-white rounded-2xl shadow-lg p-8 md:p-12 my-8 animate-fade-in-up">
      <RobotIcon className="w-20 h-20 text-indigo-500 mx-auto mb-4" />
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-3">Welcome to the AI Explorers Academy!</h1>
      <p className="text-lg text-slate-600 max-w-3xl mx-auto">
        A magical place for young minds to learn about Artificial Intelligence and coding. 
        Start a fun, interactive journey, complete missions, earn stars, and become an AI Expert!
      </p>
    </div>
  );
};

export default GuestHero;