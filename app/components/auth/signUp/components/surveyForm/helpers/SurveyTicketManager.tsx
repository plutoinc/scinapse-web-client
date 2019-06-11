import { RawQuestion } from '../constants';

interface SurveyTicketParams {
  surveyName: string;
  questions: Partial<RawQuestion>[];
}

export function SurveyTicketFormatter(rawSurveyContext: Partial<RawQuestion>[]) {
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
