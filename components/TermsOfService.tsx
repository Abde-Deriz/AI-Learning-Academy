import React from 'react';
import { BookOpenIcon, ArrowLeftIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const TermsOfService: React.FC = () => {
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
                <BookOpenIcon className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-slate-800">Terms of Service</h1>
                <p className="text-slate-500 mt-2">Please read these terms carefully before using our service.</p>
            </div>
            <div className="prose max-w-none text-slate-700">
                <h2 className="text-2xl font-bold text-slate-700">1. Acceptance of Terms</h2>
                <p>
                    By creating an account and using the Spark AI Academy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
                </p>
                <h2 className="text-2xl font-bold text-slate-700 mt-6">2. Use of the Service</h2>
                <p>
                    Spark AI Academy is an educational platform designed for learning purposes. You agree to use the service only for its intended purpose. You are responsible for your own conduct and content while using the service.
                </p>
                <h2 className="text-2xl font-bold text-slate-700 mt-6">3. User Accounts</h2>
                <p>
                    You are responsible for safeguarding your account information. You agree not to disclose your password to any third party. Since all data is stored locally on your device, we have no way to recover lost passwords or accounts.
                </p>
                <h2 className="text-2xl font-bold text-slate-700 mt-6">4. Intellectual Property</h2>
                <p>
                    All content provided on the Spark AI Academy, including courses, lessons, and icons, is the property of the academy and is protected by copyright laws. You may not reuse, republish, or redistribute any of the content without permission.
                </p>
                 <h2 className="text-2xl font-bold text-slate-700 mt-6">5. Disclaimers</h2>
                <p>
                   The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the operation or availability of the service.
                </p>
                <h2 className="text-2xl font-bold text-slate-700 mt-6">6. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your access to the service at any time, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users of the service, us, or third parties, or for any other reason.
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;