export interface CheckedAnswer {
  name: string;
  order: number;
}

export interface QuestionType {
  question: string;
  random: boolean;
  answers?: string[];
  type?: string;
  checked?: CheckedAnswer[];
}

export interface Survey {
  surveyName: string;
  questions: QuestionType[];
}
export const SCINAPSE_SURVEY_NAME = 'thinkAsScinapse';

export const SCINAPSE_SURVEY_QUESTIONS: Survey = {
  surveyName: SCINAPSE_SURVEY_NAME,
  questions: [
    {
      question: 'What do you think as Scinapse?',
      answers: ['Publisher', 'PDF Provider', 'Search Engine'],
      random: true,
      type: 'radio',
    },
  ],
};
