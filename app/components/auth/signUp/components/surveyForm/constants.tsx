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
    surveyName: 'test',
    question: 'What do you think as Scinapse?',
    answers: ['Publisher', 'PDF Provider', 'Search Engine'],
    random: true,
    type: 'radio',
  },
  { surveyName: 'A', question: 'testes?', answers: ['t', 'tt', 'aaa'], random: false, type: 'checkbox' },
  { surveyName: 'A', question: 'B', answers: ['t', 'aa', 'bb'], random: false, type: 'checkbox' },
];
