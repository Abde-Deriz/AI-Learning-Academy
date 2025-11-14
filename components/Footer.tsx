import React from 'react';
import { useAppContext } from '../context/AppContext';
import { TwitterIcon, FacebookIcon, InstagramIcon } from './Icons';

const Footer: React.FC = () => {
  const { navigate } = useAppContext();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="bg-slate-200/80 py-6 mt-12 border-t border-slate-300/60">
      <div className="container mx-auto text-center text-slate-500">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/terms-of-service" onClick={e => handleNav(e, '/terms-of-service')} className="text-sm hover:text-indigo-600 transition">Terms of Service</a>
          <a href="/privacy-policy" onClick={e => handleNav(e, '/privacy-policy')} className="text-sm hover:text-indigo-600 transition">Privacy Policy</a>
          <a href="/contact" onClick={e => handleNav(e, '/contact')} className="text-sm hover:text-indigo-600 transition">Contact Us</a>
        </div>
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="text-slate-500 hover:text-sky-500 transition" aria-label="Twitter"><TwitterIcon className="w-6 h-6" /></a>
          <a href="#" className="text-slate-500 hover:text-blue-600 transition" aria-label="Facebook"><FacebookIcon className="w-6 h-6" /></a>
          <a href="#" className="text-slate-500 hover:text-pink-500 transition" aria-label="Instagram"><InstagramIcon className="w-6 h-6" /></a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Spark AI Academy. All rights reserved.</p>
        <p className="text-xs mt-1">A place for fun, curiosity, and learning.</p>
      </div>
    </footer>
  );
};

export default Footer;