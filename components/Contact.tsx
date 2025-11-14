import React from 'react';
import { MailIcon, ArrowLeftIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const Contact: React.FC = () => {
    const { user } = useAppContext();

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        window.history.back();
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-2xl mx-auto">
             <a href="/" onClick={handleBack} className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline" aria-label="Back to previous page">
                <ArrowLeftIcon className="w-5 h-5" />
                Back
            </a>
            <div className="text-center mb-8">
                <MailIcon className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-slate-800">Contact Us</h1>
                <p className="text-slate-500 mt-2">We'd love to hear your feedback and ideas!</p>
            </div>
            
            <form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                    <input type="text" id="name" defaultValue={user?.name || ''} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-300 focus:border-indigo-500" />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1">Your Email</label>
                    <input type="email" id="email" defaultValue={user?.email || ''} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-300 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-1">Your Message</label>
                    <textarea id="message" rows={5} placeholder="Tell us what you think..." className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-300 focus:border-indigo-500"></textarea>
                </div>
                <div>
                    <button type="submit" disabled className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        Send Message (Feature coming soon)
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Contact;
