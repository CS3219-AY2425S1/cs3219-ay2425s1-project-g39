export interface PracticeHistoryItem {
  _id: string;
  userIdOne: string;
  userIdTwo: string;
  textWritten: string;
  questionId: number;
  questionName: string;
  questionDifficulty: string;
  programmingLanguage: string;
  sessionDuration: number;
  sessionStatus: string;
  datetime: string;
  __v: number;
}

export interface Progress {
  difficultyCount: {
    Easy: { completed: number; total: number };
    Medium: { completed: number; total: number };
    Hard: { completed: number; total: number };
  };
  topTopics: { topic: string; count: number }[];
}