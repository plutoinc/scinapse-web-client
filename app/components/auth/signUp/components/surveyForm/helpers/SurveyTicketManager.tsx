import { AnswerToQuestion } from '../constants';
import { omit, findIndex } from 'lodash';

interface SurveyTicketParams {
  surveyName: string;
  questions: Partial<AnswerToQuestion>[];
}

export function SurveyTicketFormatter(rawSurveyContext: Partial<AnswerToQuestion>[]) {
  let finalTicketContext: SurveyTicketParams[] = [];

  rawSurveyContext.forEach(survey => {
    const targetIndex = findIndex(finalTicketContext, ['surveyName', survey.surveyName]);
    if (targetIndex >= 0) {
      const targetSurvey = finalTicketContext[targetIndex];
      finalTicketContext = [
        ...finalTicketContext.slice(0, targetIndex),
        {
          surveyName: targetSurvey.surveyName,
          questions: [...targetSurvey.questions, omit(survey, 'surveyName')],
        },
        ...finalTicketContext.slice(targetIndex + 1, finalTicketContext.length),
      ];
    } else {
      finalTicketContext = [
        ...finalTicketContext,
        { surveyName: survey.surveyName!, questions: [omit(survey, 'surveyName')] },
      ];
    }
  });

  return JSON.stringify(finalTicketContext!);
}
