import { AnswerToQuestion } from '../constants';

interface SurveyTicketParams {
  surveyName: string;
  questions: Partial<AnswerToQuestion>[];
}

export function SurveyTicketFormatter(rawSurveyContext: Partial<AnswerToQuestion>[]) {
  let finalTicketContext: SurveyTicketParams;

  rawSurveyContext.forEach(survey => {
    const { surveyName, ...withoutSurveyNameContext } = survey;
    if (!!finalTicketContext) {
      finalTicketContext = {
        ...finalTicketContext,
        questions: [...finalTicketContext.questions, withoutSurveyNameContext],
      };
    } else {
      finalTicketContext = { surveyName: surveyName!, questions: [withoutSurveyNameContext] };
    }
  });

  return JSON.stringify(finalTicketContext!);
}
