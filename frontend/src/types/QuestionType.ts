export interface Question {
  id: string;
  _id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: string;
  images: string[];
  testCases?: TestCase[];
}

export type TestCase = {
  input: string;
  answer: string;
};

export interface UpdateQuestionInput {
  id: string;
  title: string;
  difficulty: string;
  topics: string[];
  description: string;
  images: string[];
}

export interface AddQuestionInput {
  title: string;
  difficulty: string;
  topics: string[];
  description: string;
  images: string[];
}
