import { findIndex, unionBy } from 'lodash';
import { QuestionResult } from '../components/auth/signUp/components/surveyForm/constants';
import { Actions, ACTION_TYPES } from '../actions/actionTypes';

export interface SurveyFormState {
  surveyResult: QuestionResult[];
}

export const SURVEY_FORM_INITIAL_STATE: SurveyFormState = {
  surveyResult: [],
};

export function reducer(state = SURVEY_FORM_INITIAL_STATE, action: Actions): SurveyFormState {
  switch (action.type) {
    case ACTION_TYPES.SURVEY_FORM_CLICK_ANSWER: {
      const newAnswer = action.payload.survey;
      const surveyType = action.payload.type;
      const hasAnswerIndex = findIndex(state.surveyResult, ['surveyName', newAnswer.surveyName]);

      if (hasAnswerIndex >= 0) {
        if (surveyType === 'checkbox') {
          const test = findIndex(state.surveyResult[hasAnswerIndex].checked, newAnswer.checked[0]);
          return {
            ...state,
            surveyResult: [
              ...state.surveyResult.slice(0, hasAnswerIndex),
              {
                ...state.surveyResult[hasAnswerIndex],
                checked:
                  test >= 0
                    ? [
                        ...state.surveyResult[hasAnswerIndex].checked.slice(0, test),
                        ...state.surveyResult[hasAnswerIndex].checked.slice(
                          test + 1,
                          state.surveyResult[hasAnswerIndex].checked.length
                        ),
                      ]
                    : unionBy(state.surveyResult[hasAnswerIndex].checked, newAnswer.checked, 'name'),
              },
              ...state.surveyResult.slice(hasAnswerIndex + 1, state.surveyResult.length),
            ],
          };
        } else {
          return {
            ...state,
            surveyResult: [
              ...state.surveyResult.slice(0, hasAnswerIndex),
              newAnswer,
              ...state.surveyResult.slice(hasAnswerIndex + 1, state.surveyResult.length),
            ],
          };
        }
      }
      return { ...state, surveyResult: [newAnswer, ...state.surveyResult] };
    }

    case ACTION_TYPES.SURVEY_FORM_CLICK_SUBMIT_BTN: {
      return { ...state, surveyResult: [] };
    }
  }

  return state;
}
