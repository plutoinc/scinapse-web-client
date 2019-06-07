export interface SurveyType {
  question: string;
  answers: string[];
  random: boolean;
  type: string;
  description?: string;
}

interface CheckedAnswerType {
  name: string;
  order: number;
}

export interface QuestionResult {
  surveyName: string;
  random: boolean;
  checked: CheckedAnswerType[];
}

export const SCINAPSE_SURVEY_QUESTIONS: SurveyType[] = [
  {
    question: 'What do you think as Scinapse?',
    answers: ['Publisher', 'PDF Provider', 'Search Engine'],
    random: true,
    type: 'radio',
  },
  { question: 'testes?', answers: ['t', 'tt', 'aaa'], random: false, type: 'checkbox' },
];
