import React, { useState, useMemo, useEffect } from 'react';
import { Course, Difficulty } from '../types';
import CourseCard from './CourseCard';
import Header from './Header';
import GuestHero from './GuestHero';
import ProgressSummary from './ProgressSummary';
import SearchBar from './SearchBar';
import BadgesDisplay from './BadgesDisplay';
import { useAppContext } from '../context/AppContext';
import { HeartIcon } from './Icons';

type FilterType = 'all' | Difficulty | 'favorites';

const Dashboard: React.FC = () => {
  const { courses, user, favoriteCourses, navigate } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Effect to sync component state FROM URL on mount and on history navigation (back/forward)
  useEffect(() => {
    const syncStateFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchTerm(params.get('q') || '');
      
      const difficultyParam = params.get('difficulty') as FilterType;
      // If 'favorites' filter is in URL but user isn't logged in, default to 'all'
      if (difficultyParam === 'favorites' && !user) {
        setActiveFilter('all');
      } else {
        setActiveFilter(difficultyParam || 'all');
      }
    };

    syncStateFromURL(); // Initial sync

    window.addEventListener('popstate', syncStateFromURL); // Listen for back/forward

    return () => {
      window.removeEventListener('popstate', syncStateFromURL); // Cleanup
    };
  }, [user]); // Rerun if user logs in/out, to correctly handle 'favorites' filter

  // Function to update URL FROM component state
  const updateURL = (newSearchTerm: string, newFilter: FilterType) => {
    const params = new URLSearchParams(); // Start fresh to remove old params easily
    if (newSearchTerm) {
      params.set('q', newSearchTerm);
    }
    if (newFilter && newFilter !== 'all') {
      params.set('difficulty', newFilter);
    }
    
    const newSearch = params.toString();
    const newPath = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;

    // Use replaceState to avoid cluttering browser history for filtering/searching
    window.history.replaceState({ path: newPath }, '', newPath);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    updateURL(newSearchTerm, activeFilter);
  };
  
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    updateURL(searchTerm, filter);
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
  ];
  if (user) {
    filters.push({ label: 'Favorites', value: 'favorites' });
  }

  const filteredCourses = useMemo(() => {
    let intermediateCourses = [...courses];

    // Filter by active filter
    if (activeFilter === 'favorites' && user) {
        intermediateCourses = courses.filter(course => favoriteCourses.has(course.id));
    } else if (activeFilter !== 'all' && activeFilter !== 'favorites') { // ignore 'favorites' if user is not logged in
        intermediateCourses = courses.filter(course => course.difficulty === activeFilter);
    }

    if (!searchTerm.trim()) {
      return intermediateCourses;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return intermediateCourses.filter(course => {
      const titleMatch = course.title.toLowerCase().includes(lowercasedTerm);
      const descMatch = course.description.toLowerCase().includes(lowercasedTerm);
      const lessonMatch = course.lessons.some(lesson => 
        lesson.title.toLowerCase().includes(lowercasedTerm)
      );
      return titleMatch || descMatch || lessonMatch;
    });
  }, [searchTerm, courses, activeFilter, favoriteCourses, user]);

  return (
    <div>
      <Header />
      {user ? (
        <>
          <ProgressSummary />
          <BadgesDisplay />
        </>
      ) : <GuestHero />}


      <div className="mt-8" data-guide-id="learning-path">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 
                className="text-3xl font-bold text-slate-700 animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
            >
              {user ? 'Your Learning Path' : 'Explore Our Courses'}
            </h2>
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
            {filters.map(filter => (
                <button
                    key={filter.value}
                    onClick={() => handleFilterChange(filter.value)}
                    className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${
                        activeFilter === filter.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {filter.value === 'favorites' ? <HeartIcon className="w-4 h-4 inline-block mr-1" /> : null}
                    {filter.label}
                </button>
            ))}
        </div>

        {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, index) => (
                <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={() => navigate(`/course/${course.slug}`)}
                isFirst={index === 0 && !searchTerm} // Guide only points to first card on initial load
                animationDelay={300 + index * 100}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <h3 className="text-2xl font-bold text-slate-700">No Courses Found</h3>
                <p className="text-slate-500 mt-2">
                    {searchTerm ? `We couldn't find anything for "${searchTerm}" with the current filter.` : 'Try selecting a different category!'}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;