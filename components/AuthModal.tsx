import React, { useState, useEffect } from 'react';
import { RobotIcon, CloseIcon, LoaderIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

interface AuthModalProps {
  initialView: 'login' | 'signup';
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ initialView, onClose }) => {
  const { login, signup } = useAppContext();
  const [view, setView] = useState(initialView);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (view === 'login') {
      const lastUserEmail = localStorage.getItem('ai-explorers-last-loggedIn-email');
      if (lastUserEmail) {
        setEmail(lastUserEmail);
      }
    }
  }, [view]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const accounts = JSON.parse(localStorage.getItem('ai-explorers-accounts') || '{}');
      const account = accounts[email];

      if (!account) {
        setError('Email not found. Please check your email or sign up.');
        setIsLoading(false);
        return;
      }

      if (account.pass !== password) {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
        return;
      }

      login({ email, pass: password });
      // On success, the component unmounts, so no need to set isLoading to false
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !age) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
        setError('Please enter a valid age.');
        return;
    }
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const accounts = JSON.parse(localStorage.getItem('ai-explorers-accounts') || '{}');
      if (accounts[email]) {
        setError('This email is already in use. Please log in.');
        setIsLoading(false);
        return;
      }
      
      signup({ email, pass: password, name, age: ageNum });
      // On success, the component unmounts
    }, 500);
  };

  const switchView = (newView: 'login' | 'signup') => {
    setView(newView);
    setError('');
    setPassword('');
    setName('');
    setAge('');
    // Only clear email if switching TO signup, otherwise let the useEffect handle it for login
    if (newView === 'signup') {
        setEmail('');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white/95 rounded-2xl shadow-2xl p-8 text-center w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition"><CloseIcon /></button>
        <RobotIcon className="w-20 h-20 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
          {view === 'login' ? 'Welcome Back!' : 'Join the Academy!'}
        </h1>
        <p className="text-slate-600 mb-6">
          {view === 'login' ? 'Login to continue your adventure.' : 'Create an account to save your progress.'}
        </p>

        {view === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3 border-2 rounded-lg focus:ring-indigo-300 focus:border-indigo-500" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 border-2 rounded-lg focus:ring-indigo-300 focus:border-indigo-500" />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center h-[52px] disabled:opacity-75"
            >
              {isLoading ? <LoaderIcon className="w-6 h-6 animate-spin" /> : 'Login'}
            </button>
            <p className="text-sm">
              No account? <button type="button" onClick={() => switchView('signup')} className="text-indigo-600 font-bold hover:underline">Sign Up</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required className="w-full px-4 py-3 border-2 rounded-lg focus:ring-indigo-300 focus:border-indigo-500" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3 border-2 rounded-lg focus:ring-indigo-300 focus:border-indigo-500" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 border-2 rounded-lg focus:ring-indigo-300 focus:border-indigo-500" />
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" required className="w-full px-4 py-3 border-2 rounded-lg focus:ring-indigo-300 focus:border-indigo-500" />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center h-[52px] disabled:opacity-75"
            >
              {isLoading ? <LoaderIcon className="w-6 h-6 animate-spin" /> : 'Create Account'}
            </button>
            <p className="text-sm">
              Already have an account? <button type="button" onClick={() => switchView('login')} className="text-indigo-600 font-bold hover:underline">Login</button>
            </p>
          </form>
        )}
        {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}
      </div>
    </div>
  );
};

export default AuthModal;
