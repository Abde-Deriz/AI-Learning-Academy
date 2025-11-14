
import React, { useState } from 'react';
import { RobotIcon } from './Icons';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
        <RobotIcon className="w-24 h-24 text-purple-600 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Spark AI Academy</h1>
        <p className="text-slate-600 mb-8">Ready for an adventure into the world of AI?</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your name, Explorer?"
            className="w-full px-5 py-3 text-lg border-2 border-slate-300 rounded-full shadow-inner focus:ring-4 focus:ring-purple-300 focus:border-purple-500 focus:outline-none transform transition-all duration-300 focus:scale-[1.02]"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xl py-3 rounded-full shadow-lg hover:scale-105 active:scale-100 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Start Learning!
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;