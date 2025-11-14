import React, { useState } from 'react';
import { ShareIcon, CheckIcon } from './Icons';

const ShareButton: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full transition"
        >
            {copied ? (
                <>
                    <CheckIcon className="w-5 h-5 text-green-500" />
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <ShareIcon className="w-5 h-5" />
                    <span>Share</span>
                </>
            )}
        </button>
    );
};

export default ShareButton;
