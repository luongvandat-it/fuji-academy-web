export type CourseTabId = "all" | "active" | "completed";

export type LessonType = "video" | "text" | "quiz";

export type QuizQuestionType = "multiple_choice" | "true_false";

export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  text: string;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  durationMins: number;
  isActive?: boolean;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  quizId?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  level: string;
  thumbnailUrl?: string;
  instructor: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
  videoUrl?: string;
  lessons: Lesson[];
  modules?: CourseModule[];
}
