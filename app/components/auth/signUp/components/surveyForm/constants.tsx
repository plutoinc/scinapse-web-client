export interface Survey {
  surveyName: string;
  question: string;
  answers: string[];
  random: boolean;
  type: string;
  description?: string;
}

export interface CheckedAnswer {
  name: string;
  order: number;
}

export interface AnswerToQuestion {
  surveyName: string;
  question: string;
  random: boolean;
  checked: CheckedAnswer[];
}

export const SCINAPSE_SURVEY_QUESTIONS: Survey[] = [
  {
    surveyName: 'thinkAsScinapse',
    question: 'What do you think as Scinapse?',
    answers: ['Publisher', 'PDF Provider', 'Search Engine'],
    random: true,
    type: 'radio',
  },
  { surveyName: 'thinkAsScinapse', question: 'alpha', answers: ['a', 'b', 'c'], random: true, type: 'checkbox' },
  { surveyName: 'thinkAsScinapse', question: 'beta', answers: ['d', 'e', 'f'], random: false, type: 'radio' },
];
