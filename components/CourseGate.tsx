import React from 'react';
import { Course } from '../types';
import { useAppContext } from '../context/AppContext';
import { RobotIcon } from './Icons';

const CourseGate: React.FC<{ course: Course }> = ({ course }) => {
    const { openAuthModal } = useAppContext();

    return (
        <div className="mt-8 text-center bg-gradient-to-br from-slate-100 to-slate-200/50 rounded-2xl p-8 border-2 border-dashed border-slate-300">
            <RobotIcon className="w-20 h-20 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Ready to Start Learning?</h2>
            <p className="text-slate-600 max-w-md mx-auto mt-2 mb-6">
                Create a free account or log in to begin this course, save your progress, and earn stars!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xs sm:max-w-md mx-auto">
                <button onClick={() => openAuthModal('login', `/course/${course.slug}`)} className="w-full bg-indigo-100 text-indigo-700 font-bold py-3 px-6 text-lg rounded-full hover:bg-indigo-200 transition">
                    Login
                </button>
                <button onClick={() => openAuthModal('signup', `/course/${course.slug}`)} className="w-full bg-indigo-600 text-white font-bold py-3 px-6 text-lg rounded-full hover:bg-indigo-700 transition">
                    Sign Up Now
                </button>
            </div>
        </div>
    );
};

export default CourseGate;