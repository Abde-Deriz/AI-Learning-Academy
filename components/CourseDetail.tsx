import React, { useState, useMemo, useEffect } from 'react';
import { Course, Lesson, LessonType, HelpType, Difficulty } from '../types';
import { useAppContext } from '../context/AppContext';
import { getAiHelp } from '../services/geminiService';
import { ArrowLeftIcon, CheckCircleIcon, StarIcon, LightbulbIcon, LoaderIcon, ChallengeIcon, ExamIcon, LessonIcon, ArrowRightIcon, EyeIcon, ChildIcon, SparklesIcon, QuestionMarkCircleIcon, TerminalIcon, PuzzleIcon, DrawingIcon } from './Icons';
import ProgressBar from './ProgressBar';
import LessonModal from './LessonModal';
import { FeatureTooltip } from './FeatureTooltip';
import ConfirmationModal from './ConfirmationModal';
import CourseGate from './CourseGate';
import ShareButton from './ShareButton';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  initialMissionId?: string | null;
}

const LessonTypeIcon: React.FC<{ type: LessonType, className?: string }> = ({ type, className }) => {
  switch (type) {
    case 'lesson': return <LessonIcon className={className} />;
    case 'challenge': return <ChallengeIcon className={className} />;
    case 'exam': return <ExamIcon className={className} />;
    case 'tip': return <LightbulbIcon className={className} />;
    case 'coding_challenge': return <TerminalIcon className={className} />;
    case 'logic_puzzle': return <PuzzleIcon className={className} />;
    case 'drawing_challenge': return <DrawingIcon className={className} />;
  }
};

const difficultyStyles: Record<Difficulty, string> = {
  Beginner: 'bg-green-100 text-green-800 border-green-300',
  Intermediate: 'bg-sky-100 text-sky-800 border-sky-300',
  Advanced: 'bg-purple-100 text-purple-800 border-purple-300',
};

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, initialMissionId }) => {
  const { completeLesson, getCourseProgress, user, addStarPenalty, navigate, courses } = useAppContext();
  const [aiHelp, setAiHelp] = useState<string>('');
  const [isLoadingHelp, setIsLoadingHelp] = useState<boolean>(false);
  const [activeHelpType, setActiveHelpType] = useState<HelpType | null>(null);
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [hintTakenMissions, setHintTakenMissions] = useState<Set<string>>(new Set());
  
  const completedLessons = getCourseProgress(course.id);
  
  useEffect(() => {
    if (initialMissionId) {
        const lessonToView = course.lessons.find(l => l.id === initialMissionId);
        if (lessonToView) {
            setViewingLesson(lessonToView);
        }
    } else {
        setViewingLesson(null);
    }
  }, [initialMissionId, course.lessons]);

  const handleViewLesson = (lesson: Lesson) => {
    const newPath = `/course/${course.slug}?mission=${lesson.id}`;
    navigate(newPath);
  };

  const handleCloseModal = () => {
    navigate(`/course/${course.slug}`);
  };

  const firstUncompletedLesson = useMemo(() => 
    course.lessons.find(lesson => !completedLessons.has(lesson.id)),
    [course.lessons, completedLessons]
  );
  
  const totalCourseStars = useMemo(() => {
    return course.lessons.reduce((sum, lesson) => sum + lesson.starsAwarded, 0);
  }, [course.lessons]);

  const stars = useMemo(() => {
    return course.lessons
      .filter(lesson => completedLessons.has(lesson.id))
      .reduce((sum, lesson) => sum + lesson.starsAwarded, 0);
  }, [completedLessons, course.lessons]);

  const progress = totalCourseStars > 0 ? (stars / totalCourseStars) * 100 : 0;

  const suggestedCourses = useMemo(() => {
    if (!user) return [];

    const completedCourseIds = new Set(
      courses.filter(c => {
        const progress = getCourseProgress(c.id);
        return c.lessons.length > 0 && progress.size === c.lessons.length;
      }).map(c => c.id)
    );

    const suggestions = courses.filter(c =>
      c.id !== course.id &&
      c.difficulty === course.difficulty &&
      !completedCourseIds.has(c.id)
    );
    
    // Prioritize unstarted courses
    suggestions.sort((a, b) => {
        const aStarted = getCourseProgress(a.id).size > 0;
        const bStarted = getCourseProgress(b.id).size > 0;
        if(aStarted === bStarted) return 0;
        return aStarted ? 1 : -1;
    });

    return suggestions.slice(0, 3);
  }, [user, courses, getCourseProgress, course.id, course.difficulty]);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (viewingLesson) {
        handleCloseModal();
        return;
    }
    if (user && completedLessons.size < course.lessons.length && completedLessons.size > 0) {
      setIsConfirmModalOpen(true);
    } else {
      onBack();
    }
  };

  const findNextLesson = (currentLessonId: string): Lesson | null => {
    const currentLessonIndex = course.lessons.findIndex(l => l.id === currentLessonId);
    if (currentLessonIndex === -1 || currentLessonIndex === course.lessons.length - 1) {
      return null;
    }
    // Find the next uncompleted lesson
    const nextUncompleted = course.lessons.find((lesson, index) => index > currentLessonIndex && !completedLessons.has(lesson.id));
    return nextUncompleted || null;
  };

  const handleGetHelp = async (helpType: HelpType, missionData: Lesson['missionData'] | null = null) => {
    if (helpType === 'hint' && firstUncompletedLesson && !hintTakenMissions.has(firstUncompletedLesson.id)) {
        if (user) {
            addStarPenalty(10);
            setHintTakenMissions(prev => new Set(prev).add(firstUncompletedLesson.id));
        } else {
            return;
        }
    }

    setIsLoadingHelp(true);
    setActiveHelpType(helpType);
    setAiHelp('');
    const topic = (helpType === 'hint' && firstUncompletedLesson) ? `the mission "${firstUncompletedLesson.title}"` : course.title;
    // FIX: Pass the missionType to getAiHelp for context.
    const missionType = (helpType === 'hint' && firstUncompletedLesson) ? firstUncompletedLesson.missionType : null;
    const response = await getAiHelp(topic, helpType, missionData, missionType);
    setAiHelp(response);
    setIsLoadingHelp(false);
    setActiveHelpType(null);
  };

  const helpOptions: {type: HelpType, label: string, Icon: React.FC<any>, missionData?: Lesson['missionData']}[] = [
      { type: 'tip', label: 'Fun Tip', Icon: LightbulbIcon },
      { type: 'explain', label: 'Explain Simply', Icon: ChildIcon },
      { type: 'fact', label: 'Wow Fact', Icon: SparklesIcon },
      { type: 'spark', label: 'Brain Spark', Icon: QuestionMarkCircleIcon },
  ];
  
  if (firstUncompletedLesson) {
    helpOptions.push({
      type: 'hint',
      label: 'Get a Hint',
      Icon: PuzzleIcon,
      missionData: firstUncompletedLesson.missionData
    })
  }
  
  const helpAriaLabels: { [key in HelpType]: string } = {
    tip: `Get a fun tip about ${course.title}`,
    explain: `Get a simple explanation about ${course.title}`,
    fact: `Get a wow fact about ${course.title}`,
    spark: `Get a brain spark question about ${course.title}`,
    hint: firstUncompletedLesson ? `Get a hint for the mission: ${firstUncompletedLesson.title}. Costs 10 stars.` : 'Get a hint',
  };


  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <a href="/" onClick={handleBackClick} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline" aria-label="Back to all courses">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Courses
        </a>
        <ShareButton />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
          <course.Icon className="w-12 h-12 text-white" />
        </div>
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-4xl font-extrabold text-slate-800">{course.title}</h1>
            <span className={`text-sm mt-2 sm:mt-0 font-bold px-3 py-1 rounded-full border ${difficultyStyles[course.difficulty]}`}>
              {course.difficulty}
            </span>
          </div>
          <p className="text-slate-500 mt-1">{course.description}</p>
          {user && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1 font-bold text-slate-600">
                  <span className="flex items-center"><StarIcon className="w-5 h-5 mr-1 text-amber-500" /> Course Progress</span>
                  <span>{stars} / {totalCourseStars} Stars</span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          )}
        </div>
      </div>

      {!user ? (
        <CourseGate course={course} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
              <h2 className="text-2xl font-bold text-slate-700 mb-4 border-b-2 pb-2">Missions</h2>
              <ul className="space-y-3">
              {course.lessons.map(lesson => {
                  const isCompleted = completedLessons.has(lesson.id);
                  return (
                    <li
                      key={lesson.id}
                      onClick={() => handleViewLesson(lesson)}
                      className={`p-4 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        isCompleted
                          ? 'bg-green-100 hover:bg-green-200'
                          : 'bg-slate-100 hover:bg-indigo-100 hover:shadow-sm'
                      }`}
                      aria-label={isCompleted ? `Review mission: ${lesson.title}` : `Start mission: ${lesson.title}`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-4">
                        {isCompleted ? (
                          <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                        ) : (
                          <LessonTypeIcon type={lesson.type} className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                        )}
                        <span className={`font-semibold ${isCompleted ? 'text-slate-600 line-through' : 'text-slate-800'}`}>{lesson.title}</span>
                      </div>
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-green-700 font-bold">
                          <EyeIcon className="w-5 h-5" />
                          <span>Review</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-indigo-600 font-bold">
                          <span>Start</span>
                          <ArrowRightIcon className="w-5 h-5"/>
                        </div>
                      )}
                    </li>
                  );
              })}
              </ul>
          </div>
          
          <FeatureTooltip
            featureId="ai-helper-bot"
            title="Meet your AI Helper!"
            description="Stuck? Ask for a hint for your next mission, a fun fact about the course, or a simple explanation. It's here to help!"
            position="top"
          >
            <div className="bg-sky-100/70 p-6 rounded-2xl flex flex-col">
                <h2 className="text-2xl font-bold text-sky-800 mb-4">AI Helper Bot</h2>
                <div className="grid grid-cols-2 gap-3 items-stretch">
                    {helpOptions.map(({type, label, Icon, missionData}) => {
                        const isHint = type === 'hint' && firstUncompletedLesson;
                        const isHintTaken = isHint && hintTakenMissions.has(firstUncompletedLesson.id);

                        return (
                            <button
                                key={label}
                                onClick={() => handleGetHelp(type, missionData)}
                                disabled={isLoadingHelp || (isHint && !user)}
                                className={`h-full text-white font-bold p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition text-sm disabled:cursor-not-allowed disabled:bg-sky-300 ${
                                    isLoadingHelp && activeHelpType === type ? 'bg-sky-700' : isLoadingHelp ? 'bg-sky-300' : 'bg-sky-500 hover:bg-sky-600'
                                }`}
                                aria-label={helpAriaLabels[type]}
                            >
                                <div className="flex items-center gap-2">
                                    {isLoadingHelp && activeHelpType === type ? (
                                        <LoaderIcon className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Icon className="w-5 h-5"/>
                                    )}
                                    <span>{label}</span>
                                </div>
                                {isHint && user && (
                                    <span className={`text-xs font-normal opacity-80 ${isHintTaken ? 'line-through' : ''}`}>
                                        Costs 10 Stars
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                
                <div className="mt-4 bg-white/80 p-4 rounded-lg border-2 border-sky-300 min-h-[80px] flex items-center justify-center">
                    {isLoadingHelp ? (
                        <p className="text-sky-900 font-medium text-center animate-pulse">The AI is thinking...</p>
                    ) : (
                        <p className="text-sky-900 font-medium text-center">{aiHelp || "Ask me for help!"}</p>
                    )}
                </div>

                <div className="mt-auto pt-6 text-center">
                    <img src="https://storage.googleapis.com/maker-suite-media/molly-bot/molly_thinking.gif" alt="Friendly Robot" className="w-32 h-32 rounded-full mx-auto" />
                </div>
            </div>
          </FeatureTooltip>
        </div>
      )}
      
      {user && suggestedCourses.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-700 mb-4">Ready for your next challenge?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestedCourses.map(suggested => (
                      <a
                          key={suggested.id}
                          href={`/course/${suggested.slug}`}
                          onClick={(e) => { e.preventDefault(); navigate(`/course/${suggested.slug}`); }}
                          className="group bg-slate-50 rounded-xl p-4 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all"
                      >
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${suggested.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                              <suggested.Icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-800 group-hover:text-indigo-600">{suggested.title}</h3>
                              <p className="text-xs text-slate-500">{suggested.difficulty}</p>
                          </div>
                      </a>
                  ))}
              </div>
          </div>
      )}

      {viewingLesson && (
        <LessonModal
          lesson={viewingLesson}
          courseTopic={course.title}
          reviewMode={!user || completedLessons.has(viewingLesson.id)}
          onClose={handleCloseModal}
          onComplete={(isManualOverride = false) => {
            if (viewingLesson) {
              completeLesson(course.id, viewingLesson.id);
               // If this was a manual completion in review mode, we don't need to navigate
              if(isManualOverride) {
                handleCloseModal();
              }
            }
          }}
          onNavigateNext={() => {
            if (viewingLesson) {
              const nextLesson = findNextLesson(viewingLesson.id);
              if (nextLesson) {
                handleViewLesson(nextLesson);
              } else {
                handleCloseModal(); // No more lessons
              }
            }
          }}
          hasNextLesson={!!(viewingLesson && findNextLesson(viewingLesson.id))}
        />
      )}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={onBack}
        title="Leave Course?"
        message="You have uncompleted missions. Your progress is saved, but are you sure you want to go back?"
        confirmText="Yes, Go Back"
        cancelText="Stay Here"
      />
    </div>
  );
};

export default CourseDetail;