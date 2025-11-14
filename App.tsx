import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import CertificateView from './components/CertificateView';
import AuthModal from './components/AuthModal';
import Guide from './components/Guide';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Contact from './components/Contact';
import Profile from './components/Profile';
import { Course, User, AvatarCustomization, SignupData } from './types';
import { COURSES, BADGES } from './constants';
import { soundService } from './services/soundService';
import ScrollToTopButton from './components/ScrollToTopButton';

const findCourseBySlug = (slug: string) => COURSES.find(c => c.slug === slug);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: Set<string> }>({});
  const [streak, setStreak] = useState(0);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<Set<string>>(new Set());
  const [favoriteCourses, setFavoriteCourses] = useState<Set<string>>(new Set());
  const [starPenalty, setStarPenalty] = useState<number>(0);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
  const [showGuide, setShowGuide] = useState(false);
  const [redirectOnLogin, setRedirectOnLogin] = useState<string | null>(null);

  const [path, setPath] = useState(window.location.pathname + window.location.search);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  const navigate = useCallback((newPath: string, replace = false) => {
    if (replace) {
      window.history.replaceState({}, '', newPath);
    } else {
      window.history.pushState({}, '', newPath);
    }
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  }, []);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  // Check for logged-in user on initial load
  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem('spark-ai-academy-loggedIn');
    if (loggedInUserEmail) {
      const accounts = JSON.parse(localStorage.getItem('spark-ai-academy-accounts') || '{}');
      const userData = accounts[loggedInUserEmail];
      if (userData) {
        login({ email: loggedInUserEmail, pass: userData.pass }, true);
      }
    }
  }, []);

  const openAuthModal = useCallback((view: 'login' | 'signup', redirectPath: string | null = window.location.pathname + window.location.search) => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
    
    // Don't set redirect for generic auth pages
    const pathname = redirectPath ? redirectPath.split('?')[0] : '';
    if (redirectPath && !['/login', '/signup', '/'].includes(pathname)) {
        setRedirectOnLogin(redirectPath);
    } else {
        setRedirectOnLogin(null);
    }

    // Update URL without adding to history if not already correct
    if (window.location.pathname !== `/${view}`) {
        navigate(`/${view}`, true);
    }
  }, [navigate]);

  // Handle routing for auth modals
  useEffect(() => {
    const pathname = path.split('?')[0];

    if (user) {
      // If user is logged in, redirect away from auth pages and ensure modal is closed.
      if (pathname === '/login' || pathname === '/signup') {
        navigate('/');
      }
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
      return;
    }

    // Logic for guest users:
    if (pathname === '/login') {
      openAuthModal('login');
    } else if (pathname === '/signup') {
      openAuthModal('signup');
    } else if (isAuthModalOpen) {
      // If path changes away from login/signup, close modal,
      // unless on a course page which might need the modal for gating content.
      const isOnCoursePage = pathname.match(/\/course\/([^/]+)/);
      if (!isOnCoursePage) {
        setIsAuthModalOpen(false);
      }
    }
  }, [path, user, isAuthModalOpen, navigate, openAuthModal]);

  const totalStars = useMemo(() => {
    let total = 0;
    for (const courseId in progress) {
      const completedLessonIds = progress[courseId];
      const course = COURSES.find(c => c.id === courseId);
      if (course) {
        for (const lessonId of completedLessonIds) {
          const lesson = course.lessons.find(l => l.id === lessonId);
          if (lesson) {
            total += lesson.starsAwarded;
          }
        }
      }
    }
    return total - starPenalty;
  }, [progress, starPenalty]);
  
  const earnedBadges = useMemo(() => {
    return BADGES.filter(badge => earnedBadgeIds.has(badge.id));
  }, [earnedBadgeIds]);

  // Effect to check for and award new badges
  useEffect(() => {
    if (!user) return;

    const newBadges: string[] = [];
    const context = { progress, totalStars, courses: COURSES };

    BADGES.forEach(badge => {
      if (!earnedBadgeIds.has(badge.id) && badge.condition(context)) {
        newBadges.push(badge.id);
      }
    });

    if (newBadges.length > 0) {
      const updatedBadgeIds = new Set([...earnedBadgeIds, ...newBadges]);
      setEarnedBadgeIds(updatedBadgeIds);

      const profileJSON = localStorage.getItem(`spark-ai-academy-profile-${user.email}`);
      if (profileJSON) {
        const profile = JSON.parse(profileJSON);
        profile.badges = Array.from(updatedBadgeIds);
        localStorage.setItem(`spark-ai-academy-profile-${user.email}`, JSON.stringify(profile));
      }
    }
  }, [progress, totalStars, user, earnedBadgeIds]);

  const closeModal = useCallback(() => {
    setIsAuthModalOpen(false);
    // If we are on a login/signup path, navigate back to home
    if(path.startsWith('/login') || path.startsWith('/signup')) {
        navigate('/');
    }
  }, [path, navigate]);

  const signup = (signupData: SignupData): boolean => {
    const accounts = JSON.parse(localStorage.getItem('spark-ai-academy-accounts') || '{}');
    if (accounts[signupData.email]) {
      alert('An account with this email already exists!');
      return false;
    }

    accounts[signupData.email] = { pass: signupData.pass, name: signupData.name, age: signupData.age };
    localStorage.setItem('spark-ai-academy-accounts', JSON.stringify(accounts));

    const initialProfile = {
      avatar: { icon: 'default' },
      streakData: { count: 0, lastLogin: '' },
      progress: {},
      badges: [],
      favorites: [],
      starPenalty: 0,
    };
    localStorage.setItem(`spark-ai-academy-profile-${signupData.email}`, JSON.stringify(initialProfile));

    return login({ email: signupData.email, pass: signupData.pass });
  };

  const login = (credentials: { email: string, pass: string }, isAutoLogin = false): boolean => {
    const accounts = JSON.parse(localStorage.getItem('spark-ai-academy-accounts') || '{}');
    const account = accounts[credentials.email];

    if (!account || (!isAutoLogin && account.pass !== credentials.pass)) {
      if (!isAutoLogin) alert('Invalid email or password.');
      return false;
    }
    
    const profileJSON = localStorage.getItem(`spark-ai-academy-profile-${credentials.email}`);
    const profile = profileJSON ? JSON.parse(profileJSON) : { avatar: { icon: 'default' }, streakData: { count: 1, lastLogin: '' }, progress: {}, badges: [], favorites: [], starPenalty: 0 };
    
    const initialProgress: { [key: string]: Set<string> } = {};
    Object.keys(profile.progress).forEach(courseId => {
      initialProgress[courseId] = new Set(profile.progress[courseId]);
    });
    setProgress(initialProgress);
    setEarnedBadgeIds(new Set(profile.badges || []));
    setFavoriteCourses(new Set(profile.favorites || []));
    setStarPenalty(profile.starPenalty || 0);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    let currentStreak = 1;
    if (profile.streakData && profile.streakData.lastLogin) {
      const lastLoginDate = new Date(profile.streakData.lastLogin);
      const diffTime = today.setHours(0,0,0,0) - lastLoginDate.setHours(0,0,0,0);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
          currentStreak = profile.streakData.count + 1;
      } else if (diffDays > 1) {
          currentStreak = 1;
      } else {
          currentStreak = profile.streakData.count || 1;
      }
    }
    profile.streakData = { count: currentStreak, lastLogin: todayStr };
    setStreak(currentStreak);

    const loggedInUser: User = {
      name: account.name,
      email: credentials.email,
      age: account.age,
      avatar: profile.avatar,
    };
    setUser(loggedInUser);

    localStorage.setItem(`spark-ai-academy-profile-${credentials.email}`, JSON.stringify(profile));
    localStorage.setItem('spark-ai-academy-loggedIn', credentials.email);

    const hasSeenGuide = localStorage.getItem(`spark-ai-academy-guide-seen-${credentials.email}`);
    if (!hasSeenGuide) {
      setShowGuide(true);
    }

    setIsAuthModalOpen(false);
    if (redirectOnLogin) {
        navigate(redirectOnLogin);
        setRedirectOnLogin(null);
    } else if (!isAutoLogin) {
        navigate('/');
    }
    return true;
  };

  const handleLogout = () => {
    if (user) {
      localStorage.setItem('spark-ai-academy-last-loggedIn-email', user.email);
    }
    setUser(null);
    setProgress({});
    setStreak(0);
    setStarPenalty(0);
    setEarnedBadgeIds(new Set());
    setFavoriteCourses(new Set());
    localStorage.removeItem('spark-ai-academy-loggedIn');
    navigate('/');
  };

  const completeLesson = useCallback((courseId: string, lessonId: string) => {
    if (!user) {
      openAuthModal('signup');
      return;
    }
    
    setProgress(prev => {
      const course = COURSES.find(c => c.id === courseId);
      if (!course) return prev;

      const oldCourseProgress = prev[courseId] || new Set();
      if (oldCourseProgress.has(lessonId)) {
        return prev;
      }

      const newProgress = { ...prev };
      const newCourseProgress = new Set(oldCourseProgress);
      newCourseProgress.add(lessonId);
      newProgress[courseId] = newCourseProgress;
      
      const isCourseNowCompleted = newCourseProgress.size === course.lessons.length && course.lessons.length > 0;
      
      const profileJSON = localStorage.getItem(`spark-ai-academy-profile-${user.email}`);
      const profile = profileJSON ? JSON.parse(profileJSON) : {};
      const progressToStore: { [key: string]: string[] } = {};
      Object.keys(newProgress).forEach(cId => {
          progressToStore[cId] = Array.from(newProgress[cId]);
      });
      profile.progress = progressToStore;
      localStorage.setItem(`spark-ai-academy-profile-${user.email}`, JSON.stringify(profile));
      
      setTimeout(() => {
        if (isCourseNowCompleted) {
          soundService.playCourseComplete();
          sessionStorage.setItem('justCompletedCourseId', courseId);
        } else {
          soundService.playStar();
        }
      }, 0);

      return newProgress;
    });
  }, [user, openAuthModal]);

  const getCourseProgress = useCallback((courseId: string): Set<string> => {
    return progress[courseId] || new Set();
  }, [progress]);

  const updateUser = useCallback((newUserData: { name?: string, avatar?: AvatarCustomization }) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser: User = { ...prevUser, ...newUserData };
        const accounts = JSON.parse(localStorage.getItem('spark-ai-academy-accounts') || '{}');
        if (accounts[prevUser.email] && newUserData.name) {
            accounts[prevUser.email].name = newUserData.name;
            localStorage.setItem('spark-ai-academy-accounts', JSON.stringify(accounts));
        }

        const profileJSON = localStorage.getItem(`spark-ai-academy-profile-${prevUser.email}`);
        if (profileJSON) {
            const profile = JSON.parse(profileJSON);
            profile.avatar = updatedUser.avatar;
            localStorage.setItem(`spark-ai-academy-profile-${prevUser.email}`, JSON.stringify(profile));
        }
        return updatedUser;
    });
  }, []);

  const toggleFavoriteCourse = useCallback((courseId: string) => {
    if (!user) {
        openAuthModal('login');
        return;
    }
    setFavoriteCourses(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(courseId)) {
            newFavorites.delete(courseId);
        } else {
            newFavorites.add(courseId);
        }

        const profileJSON = localStorage.getItem(`spark-ai-academy-profile-${user.email}`);
        if (profileJSON) {
            const profile = JSON.parse(profileJSON);
            profile.favorites = Array.from(newFavorites);
            localStorage.setItem(`spark-ai-academy-profile-${user.email}`, JSON.stringify(profile));
        }
        return newFavorites;
    });
  }, [user, openAuthModal]);
  
  const addStarPenalty = useCallback((amount: number) => {
    if (!user) return;
    setStarPenalty(prevPenalty => {
        const newPenalty = prevPenalty + amount;
        const profileJSON = localStorage.getItem(`spark-ai-academy-profile-${user.email}`);
        if (profileJSON) {
            const profile = JSON.parse(profileJSON);
            profile.starPenalty = newPenalty;
            localStorage.setItem(`spark-ai-academy-profile-${user.email}`, JSON.stringify(profile));
        }
        return newPenalty;
    });
  }, [user]);
  
  const handleFinishGuide = () => {
    if (user) {
        localStorage.setItem(`spark-ai-academy-guide-seen-${user.email}`, 'true');
    }
    setShowGuide(false);
  }

  const isExpert = totalStars >= 1000;

  const renderContent = () => {
    if (user && isExpert) {
        return <CertificateView userName={user.name} onReset={handleLogout} />;
    }
    
    const pathname = path.split('?')[0];
    const courseMatch = pathname.match(/\/course\/([^/]+)/);
    
    if (courseMatch) {
        const course = findCourseBySlug(courseMatch[1]);
        if (course) {
            const searchParams = new URLSearchParams(path.split('?')[1] || '');
            const initialMissionId = searchParams.get('mission');
            return <CourseDetail course={course} onBack={() => navigate('/')} initialMissionId={initialMissionId} />;
        }
    }
    
    if (pathname === '/profile/favorites') {
      return <Profile />;
    }
    if (pathname === '/privacy-policy') {
      return <PrivacyPolicy />;
    }
    if (pathname === '/terms-of-service') {
      return <TermsOfService />;
    }
    if (pathname === '/contact') {
      return <Contact />;
    }
    
    return <Dashboard />;
  };

  return (
    <AppProvider value={{ user, totalStars, streak, completeLesson, getCourseProgress, courses: COURSES, logout: handleLogout, updateUser, login, signup, openAuthModal, earnedBadges, favoriteCourses, toggleFavoriteCourse, addStarPenalty, navigate }}>
      <div className="bg-slate-100 min-h-screen text-slate-800 flex flex-col">
        <main className="container mx-auto p-4 md:p-8 flex-grow">
          {renderContent()}
        </main>
        <Footer />
      </div>
      {isAuthModalOpen && <AuthModal initialView={authModalView} onClose={closeModal} />}
      {showGuide && <Guide onFinish={handleFinishGuide} />}
      <ScrollToTopButton />
    </AppProvider>
  );
}