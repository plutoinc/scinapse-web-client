export interface SurveyType {
  surveyName: string;
  question: string;
  answers: string[];
  random: boolean;
  type: string;
  description?: string;
}

export interface CheckedAnswerType {
  name: string;
  order: number;
}

export interface QuestionResult {
  surveyName: string;
  question: string;
  random: boolean;
  checked: CheckedAnswerType[];
}

export const SCINAPSE_SURVEY_QUESTIONS: SurveyType[] = [
  {
    surveyName: 'thinkAsScinapse',
    question: 'What do you think as Scinapse?',
    answers: ['Publisher', 'PDF Provider', 'Search Engine'],
    random: true,
    type: 'radio',
  },
  { surveyName: 'A', question: 'alpha', answers: ['a', 'b', 'c'], random: true, type: 'checkbox' },
  { surveyName: 'A', question: 'beta', answers: ['d', 'e', 'f'], random: false, type: 'radio' },
];
