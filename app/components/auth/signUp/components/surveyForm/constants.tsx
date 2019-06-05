export interface SurveyType {
  question: string;
  answers: string[];
  random: boolean;
  description?: string;
}

interface CheckedAnswerType {
  name: string;
  order: number;
}

export interface QuestionResult {
  surveyName: string;
  random: boolean;
  checked: CheckedAnswerType;
}

export const SCINAPSE_SURVEY_QUESTIONS: SurveyType[] = [
  { question: 'What do you think as Scinapse?', answers: ['Publisher', 'PDF Provider', 'Search Engine'], random: true },
];
