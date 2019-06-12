interface CheckedAnswer {
  name: string;
  order: number;
}

export interface Q {
  question: string;
  answers: string[];
  random: boolean;
  type: string;
  description?: string;
}

export interface Survey {
  surveyName: string;
  questions: Q[];
}

export interface RawQuestion {
  surveyName: string;
  questions: {
    question: string;
    random: boolean;
    checked: CheckedAnswer[];
  }[];
}

export const SCINAPSE_SURVEY_QUESTIONS: Survey = {
  surveyName: 'thinkAsScinapse',
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
