import React, { useState, useEffect, useMemo } from 'react';
import { Course, Difficulty } from '../types';
import { useAppContext } from '../context/AppContext';
import ProgressBar from './ProgressBar';
import { StarIcon, BadgeCheckIcon, HeartIcon, TerminalIcon, PuzzleIcon, GripVerticalIcon } from './Icons';

interface CourseCardProps {
  course: Course;
  onSelectCourse: (course: Course) => void;
  isFirst?: boolean;
  animationDelay?: number;
}

const difficultyStyles: Record<Difficulty, string> = {
  Beginner: 'bg-green-100 text-green-800 border-green-300',
  Intermediate: 'bg-sky-100 text-sky-800 border-sky-300',
  Advanced: 'bg-purple-100 text-purple-800 border-purple-300',
};

const IconWithTooltip: React.FC<{Icon: React.FC<any>, tooltip: string}> = ({Icon, tooltip}) => (
    <div className="relative group">
        <Icon className="w-5 h-5 text-slate-400" />
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
        </div>
    </div>
);

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelectCourse, isFirst = false, animationDelay = 0 }) => {
  const { getCourseProgress, favoriteCourses, toggleFavoriteCourse, user } = useAppContext();
  const completedLessons = getCourseProgress(course.id);
  const totalLessons = course.lessons.length;

  const totalStars = useMemo(() => course.lessons.reduce((sum, lesson) => sum + lesson.starsAwarded, 0), [course.lessons]);

  const stars = useMemo(() => {
    return course.lessons
      .filter(lesson => completedLessons.has(lesson.id))
      .reduce((sum, lesson) => sum + lesson.starsAwarded, 0);
  }, [completedLessons, course.lessons]);

  const progress = totalStars > 0 ? (stars / totalStars) * 100 : 0;
  const isCompleted = totalLessons > 0 && completedLessons.size === totalLessons;
  const isStarted = completedLessons.size > 0 && !isCompleted;
  const isFavorite = favoriteCourses.has(course.id);

  const specialMissionTypes = useMemo(() => {
    const types = new Set<'coding' | 'logic' | 'reorder'>();
    for (const lesson of course.lessons) {
        if (lesson.type === 'coding_challenge') types.add('coding');
        if (lesson.type === 'logic_puzzle') types.add('logic');
        if (lesson.missionType === 'drag_drop_order') types.add('reorder');
    }
    return Array.from(types);
  }, [course.lessons]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteCourse(course.id);
  };

  const [isJustCompleted, setIsJustCompleted] = useState(false);

  useEffect(() => {
    const justCompletedId = sessionStorage.getItem('justCompletedCourseId');
    if (justCompletedId === course.id) {
      setIsJustCompleted(true);
      sessionStorage.removeItem('justCompletedCourseId');

      const timer = setTimeout(() => {
        setIsJustCompleted(false);
      }, 1500); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [course.id]);


  return (
    <div
      className={`group bg-white rounded-2xl shadow-lg ${course.shadowColor} transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between animate-fade-in-up relative overflow-hidden ${isJustCompleted ? 'animate-celebrate-flash' : ''}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      {...(isFirst && { 'data-guide-id': 'course-card-1' })}
    >
      <div 
        onClick={() => onSelectCourse(course)} 
        className="p-6 cursor-pointer flex flex-col justify-between flex-grow"
        aria-label={`Course: ${course.title}. Difficulty: ${course.difficulty}. You have ${stars} out of ${totalStars} stars. ${isCompleted ? 'Completed.' : ''}`}
      >
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          {isCompleted && (
            <div title="Course Completed!" className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pop-in">
              <BadgeCheckIcon className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}
          {isStarted && (
            <div title="In Progress" className="bg-sky-100 text-sky-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <span>In Progress</span>
            </div>
          )}
          {!isCompleted && !isStarted && (
              <div title="Not Started" className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <span>Not Started</span>
              </div>
          )}
          {user && (
            <button 
                onClick={handleFavoriteClick} 
                className="p-1.5 rounded-full bg-white/70 hover:bg-white transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <HeartIcon className={`w-5 h-5 transition-all ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-400'}`} />
            </button>
          )}
        </div>

        <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border ${difficultyStyles[course.difficulty]}`}>
          {course.difficulty}
        </div>

        <div>
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[12deg] group-hover:brightness-110 mt-8`}>
            <course.Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300 pt-4">{course.title}</h3>
          <p className="text-slate-500 mt-1 text-sm h-14 md:h-16 line-clamp-3">{course.description}</p>
        </div>
        <div className="mt-4">
          {specialMissionTypes.length > 0 && (
            <div className="mb-4 pt-4 border-t border-slate-200 flex items-center gap-3 text-slate-500">
              <span className="text-xs font-bold">Activities:</span>
              <div className="flex items-center gap-3">
                {specialMissionTypes.includes('coding') && <IconWithTooltip Icon={TerminalIcon} tooltip="Coding Challenges" />}
                {specialMissionTypes.includes('logic') && <IconWithTooltip Icon={PuzzleIcon} tooltip="Logic Puzzles" />}
                {specialMissionTypes.includes('reorder') && <IconWithTooltip Icon={GripVerticalIcon} tooltip="Drag & Drop" />}
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mb-1 text-sm font-bold">
              <span className="text-amber-500 flex items-center"><StarIcon className="w-4 h-4 mr-1"/> Stars</span>
              <span>{stars} / {totalStars}</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;