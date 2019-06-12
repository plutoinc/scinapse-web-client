interface CheckedAnswer {
  name: string;
  order: number;
}

export interface RawQuestionType {
  question: string;
  answers: string[];
  random: boolean;
  type: string;
  description?: string;
}

interface QuestionType {
  question: string;
  random: boolean;
  checked: CheckedAnswer[];
}

export interface RawSurvey {
  surveyName: string;
  questions: RawQuestionType[];
}

export interface Survey {
  surveyName: string;
  questions: QuestionType[];
}
export const SCINAPSE_SURVEY_NAME = 'thinkAsScinapse';

export const SCINAPSE_SURVEY_QUESTIONS: RawSurvey = {
  surveyName: SCINAPSE_SURVEY_NAME,
  questions: [
    {
      question: 'What do you think as Scinapse?',
      answers: ['Publisher', 'PDF Provider', 'Search Engine'],
      random: true,
      type: 'radio',
    },
    { question: 'alpha', answers: ['a', 'b', 'c'], random: true, type: 'checkbox' },
  ],
};
