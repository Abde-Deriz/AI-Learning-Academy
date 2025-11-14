import React from 'react';
import { ShieldIcon, ArrowLeftIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const PrivacyPolicy: React.FC = () => {
    const { navigate } = useAppContext();

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        window.history.back();
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
             <a href="/" onClick={handleBack} className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline" aria-label="Back to previous page">
                <ArrowLeftIcon className="w-5 h-5" />
                Back
            </a>
            <div className="text-center mb-8">
                <ShieldIcon className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-slate-800">Privacy Policy</h1>
                <p className="text-slate-500 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="prose max-w-none text-slate-700">
                <h2 className="text-2xl font-bold text-slate-700">Introduction</h2>
                <p>
                    Welcome to Spark AI Academy! We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy sets out how we collect, use, and safeguard your information when you use our application.
                </p>
                <h2 className="text-2xl font-bold text-slate-700 mt-6">Information We Collect</h2>
                <p>
                    We collect information that you provide to us directly, such as when you create an account. This may include:
                </p>
                <ul>
                    <li>Your chosen name or nickname</li>
                    <li>Your email address</li>
                    <li>Your age</li>
                    <li>Your course progress, stars earned, and badges collected</li>
                </ul>
                <h2 className="text-2xl font-bold text-slate-700 mt-6">How We Use Your Information</h2>
                <p>
                    The information we collect is used solely to provide and improve the Spark AI Academy experience. Specifically, we use it to:
                </p>
                <ul>
                    <li>Create and manage your user account.</li>
                    <li>Save and display your learning progress.</li>
                    <li>Personalize your experience within the app.</li>
                    <li>Award badges and track your achievements.</li>
                </ul>
                 <h2 className="text-2xl font-bold text-slate-700 mt-6">Data Storage</h2>
                <p>
                   All your account information and progress are stored locally in your web browser's storage. We do not transmit this data to any external servers or databases. This means your data stays on your device.
                </p>
                <h2 className="text-2xl font-bold text-slate-700 mt-6">Children's Privacy</h2>
                <p>
                    Our platform is designed for children. We are committed to protecting the privacy of our youngest learners. We only collect the minimum information necessary for the app to function and do not share it with third parties.
                </p>
                <h2 className="text-2xl font-bold text-slate-700 mt-6">Changes to This Policy</h2>
                <p>
                    We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;