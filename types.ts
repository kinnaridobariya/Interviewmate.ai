
export enum AppState {
  WELCOME,
  SETUP,
  INTERVIEW,
  REVIEW,
}

export interface InterviewFeedback {
  clarity: string;
  relevance: string;
  completeness: string;
  summary: string;
}

export interface InterviewSession {
  role: string;
  questions: string[];
  answers: { [questionIndex: number]: string };
  feedback: { [questionIndex: number]: InterviewFeedback };
}
