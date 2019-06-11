import { findIndex, unionBy } from 'lodash';
import { AnswerToQuestion } from '../components/auth/signUp/components/surveyForm/constants';
import { Actions, ACTION_TYPES } from '../actions/actionTypes';

export interface SurveyFormState {
  surveyResult: AnswerToQuestion[];
}

export const SURVEY_FORM_INITIAL_STATE: SurveyFormState = {
  surveyResult: [],
};

export function reducer(state = SURVEY_FORM_INITIAL_STATE, action: Actions): SurveyFormState {
  switch (action.type) {
    case ACTION_TYPES.SURVEY_FORM_CLICK_ANSWER: {
      const newAnswer = action.payload.survey;
      const surveyType = action.payload.type;
      const targetSurveyIndex = findIndex(state.surveyResult, ['question', newAnswer.question]);

      if (targetSurveyIndex >= 0) {
        const targetSurvey = state.surveyResult[targetSurveyIndex];
        if (surveyType === 'checkbox') {
          const targetAnswerIndex = findIndex(targetSurvey.checked, newAnswer.checked[0]);
          return {
            ...state,
            surveyResult: [
              ...state.surveyResult.slice(0, targetSurveyIndex),
              {
                ...targetSurvey,
                checked:
                  targetAnswerIndex >= 0
                    ? [
                        ...targetSurvey.checked.slice(0, targetAnswerIndex),
                        ...targetSurvey.checked.slice(targetAnswerIndex + 1, targetSurvey.checked.length),
                      ]
                    : unionBy(targetSurvey.checked, newAnswer.checked, 'name'),
              },
              ...state.surveyResult.slice(targetSurveyIndex + 1, state.surveyResult.length),
            ],
          };
        } else {
          return {
            ...state,
            surveyResult: [
              ...state.surveyResult.slice(0, targetSurveyIndex),
              newAnswer,
              ...state.surveyResult.slice(targetSurveyIndex + 1, state.surveyResult.length),
            ],
          };
        }
      }
      return { ...state, surveyResult: [newAnswer, ...state.surveyResult] };
    }

    case ACTION_TYPES.SURVEY_FORM_CLICK_SUBMIT_BTN: {
      return { ...state, surveyResult: [] };
    }

    case ACTION_TYPES.SURVEY_FORM_CLICK_SKIP_BTN: {
      return { ...state, surveyResult: [] };
    }
  }

  return state;
}
