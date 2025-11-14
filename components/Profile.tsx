import React from 'react';
import { Course } from '../types';
import CourseCard from './CourseCard';
import Header from './Header';
import { useAppContext } from '../context/AppContext';
import { HeartIcon } from './Icons';

const Profile: React.FC = () => {
  const { courses, user, favoriteCourses, navigate } = useAppContext();

  if (!user) {
    // This should ideally be handled by a route guard in App.tsx
    // but as a fallback:
    return (
        <div className="text-center">
            <p>Please log in to see your profile.</p>
            <button onClick={() => navigate('/login')} className="mt-4 bg-indigo-600 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700 transition">
                Login
            </button>
        </div>
    )
  }

  const favoriteCourseDetails = courses.filter(course => favoriteCourses.has(course.id));

  return (
    <div>
      <Header />
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
            <HeartIcon className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-slate-700">
                My Favorite Courses
            </h2>
        </div>

        {favoriteCourseDetails.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteCourseDetails.map((course, index) => (
                <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={() => navigate(`/course/${course.slug}`)}
                animationDelay={100 + index * 100}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border-2 border-dashed">
                <HeartIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-700">No Favorites Yet!</h3>
                <p className="text-slate-500 mt-2">
                   Click the heart icon on any course to add it to this list.
                </p>
                 <button onClick={() => navigate('/')} className="mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-700 transition">
                    Explore Courses
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
