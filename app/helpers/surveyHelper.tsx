import { shuffle } from 'lodash';

export type AvailableSurveyQuestion = (RadioSurveyQuestion | CheckboxSurveyQuestion | InputSurveyQuestion)
export interface Survey {
  name: string;
  questions: AvailableSurveyQuestion[];
  shuffle: boolean;
}

interface SurveyQuestion {
  type: 'radio' | 'checkbox' | 'input'
  content: string;
  isFinished: boolean;
  optional?: boolean;
  shuffle?: boolean;
}

export interface AnswerParams {
  answer: string | string[];
  questionIndex: number;
  optionIndex: number;
}

export interface RadioSurveyQuestion extends SurveyQuestion {
  options: string[];
  answer: string;
}

interface CheckboxSurveyQuestion extends SurveyQuestion {
  options: string[];
  answer: string[];
}

interface InputSurveyQuestion extends SurveyQuestion {
  answer: string;
}

export const HOW_TO_FEEL_SURVEY: Survey = {
  name: 'howToFeelScinapse',
  questions: [
    {
      type: 'radio',
      content: 'What do you think as Scinapse?',
      options: ['Publisher', 'PDF Provider', 'Search Engine'],
      shuffle: true,
      isFinished: false,
      answer: ""
    },
  ],
  shuffle: false,
};

export function makeSurvey(survey: Survey) {
  const optionShuffledQuestions = survey.questions.map(q => {
    if (!q.shuffle || q.type === 'input') {
      return q;
    }
    const newOptions = shuffle((q as (RadioSurveyQuestion|CheckboxSurveyQuestion)).options);
    return {...q, options: newOptions};
  });
  const shuffledQuestions = survey.shuffle ? shuffle(optionShuffledQuestions) : optionShuffledQuestions;  
  return {...survey, questions: shuffledQuestions};
}
