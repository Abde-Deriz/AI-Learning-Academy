import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { StarIcon, TrophyIcon, BookOpenIcon } from './Icons';
import ProgressBar from './ProgressBar';

const ProgressSummary: React.FC = () => {
    const { courses, getCourseProgress, totalStars } = useAppContext();

    const coursesCompleted = useMemo(() => {
        return courses.filter(c => {
            const progressSet = getCourseProgress(c.id);
            return c.lessons.length > 0 && progressSet.size === c.lessons.length;
        }).length;
    }, [courses, getCourseProgress]);

    const totalLessonsCompleted = useMemo(() => {
        let count = 0;
        courses.forEach(c => {
            count += getCourseProgress(c.id).size;
        });
        return count;
    }, [courses, getCourseProgress]);
    
    const totalLessons = useMemo(() => {
        return courses.reduce((sum, course) => sum + course.lessons.length, 0);
    }, [courses]);

    const AI_EXPERT_GOAL = 1000;
    const certificateProgress = totalStars < AI_EXPERT_GOAL ? (totalStars / AI_EXPERT_GOAL) * 100 : 100;

    const StatCard: React.FC<{ icon: React.FC<any>, value: string, label: string, color: string }> = ({ icon: Icon, value, label, color }) => (
        <div className="bg-white/80 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}>
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold">{label}</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 my-8 animate-fade-in-up">
            <h2 className="text-lg sm:text-xl font-bold text-slate-700 mb-4">Your Progress Report</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <StatCard 
                    icon={TrophyIcon}
                    value={`${coursesCompleted} / ${courses.length}`}
                    label="Courses Completed"
                    color="bg-gradient-to-br from-green-400 to-emerald-500"
                />
                <StatCard 
                    icon={BookOpenIcon}
                    value={`${totalLessonsCompleted} / ${totalLessons}`}
                    label="Lessons Finished"
                    color="bg-gradient-to-br from-sky-400 to-blue-500"
                />
                <StatCard 
                    icon={StarIcon}
                    value={totalStars.toString()}
                    label="Total Stars Earned"
                    color="bg-gradient-to-br from-amber-400 to-yellow-500"
                />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                    <span className="text-slate-600">Path to "AI Expert" Certificate</span>
                    <span className="text-amber-600 flex items-center gap-1">
                        <StarIcon className="w-4 h-4" /> {Math.min(totalStars, AI_EXPERT_GOAL)} / {AI_EXPERT_GOAL}
                    </span>
                </div>
                <ProgressBar progress={certificateProgress} color="bg-gradient-to-r from-amber-400 to-orange-500" />
            </div>
        </div>
    );
};

export default ProgressSummary;
