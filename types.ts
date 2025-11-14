import { ComponentType } from 'react';

export type LessonType = 'lesson' | 'challenge' | 'exam' | 'tip' | 'coding_challenge' | 'logic_puzzle' | 'drawing_challenge';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

// Mission Data Structures
export interface MissionInfo { text: string; }
export interface MissionQuiz { question: string; options: string[]; correctAnswerIndex: number; }
export interface MissionQnA { question: string; keywords: string[]; placeholder?: string; }
export interface MissionDragDropOrder { prompt: string; items: { id: string; content: string }[]; correctOrder: string[]; }
export interface MissionCodingGame { prompt: string; codeBefore: string; codeAfter: string; options: string[]; correctAnswerIndex: number; }
export interface MissionLogicPuzzle { puzzle: string; correctAnswer: string; placeholder?: string; }
export interface MissionJigsawPuzzle {
  prompt: string;
  image: string; // URL to the completed image
  pieces: { id: string; content: string }[]; // The text/label on the piece
  correctOrder: string[]; // The order the pieces should be placed in
}

export interface MissionFillInTheBlanks {
  prompt: string;
  parts: (string | { id: string; correctValue: string })[]; // Mix of text and blank objects
  options: string[]; // Draggable word options
}

export type MissionData = MissionInfo | MissionQuiz | MissionQnA | MissionDragDropOrder | MissionCodingGame | MissionLogicPuzzle | MissionJigsawPuzzle | MissionFillInTheBlanks;
export type MissionType = 'info' | 'quiz' | 'q_and_a' | 'drag_drop_order' | 'coding_game' | 'logic_puzzle' | 'jigsaw_puzzle' | 'fill_in_the_blanks';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  starsAwarded: number;
  missionType: MissionType;
  missionData: MissionData;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  lessons: Lesson[];
  color: string;
  shadowColor: string;
  difficulty: Difficulty;
}

export interface AvatarCustomization {
  icon: string; // e.g., 'default', 'cute', 'wise'
}

export interface User {
  name: string;
  email: string;
  age: number;
  avatar: AvatarCustomization;
}

export interface SignupData {
    name: string;
    email: string;
    pass: string;
    age: number;
}


export type HelpType = 'tip' | 'explain' | 'fact' | 'spark' | 'hint';

export interface Badge {
  id: string;
  name: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  condition: BadgeConditionFunction;
}

export type BadgeConditionFunction = (context: {
  progress: { [key: string]: Set<string> };
  totalStars: number;
  courses: Course[];
}) => boolean;

export interface AppContextType {
  user: User | null;
  totalStars: number;
  streak: number;
  courses: Course[];
  completeLesson: (courseId: string, lessonId: string) => void;
  getCourseProgress: (courseId: string) => Set<string>;
  logout: () => void;
  updateUser: (newUserData: { name?: string, avatar?: AvatarCustomization }) => void;
  login: (credentials: {email: string, pass: string}) => boolean;
  signup: (userData: SignupData) => boolean;
  openAuthModal: (view: 'login' | 'signup', redirectPath?: string | null) => void;
  earnedBadges: Badge[];
  favoriteCourses: Set<string>;
  toggleFavoriteCourse: (courseId: string) => void;
  addStarPenalty: (amount: number) => void;
  navigate: (path: string, replace?: boolean) => void;
}
