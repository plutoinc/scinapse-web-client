import * as React from 'react';
import { Dispatch } from 'redux';
import { SurveyType, QuestionResult } from '../constants';
import { withStyles } from '../../../../../../helpers/withStylesHelper';
import { ActionCreators } from '../../../../../../actions/actionTypes';
const styles = require('./question.scss');

interface QuestionProps {
  context: SurveyType;
  qKey: number;
  dispatch: Dispatch<any>;
}

interface AnswerProps {
  value: string;
  name: string;
  handleOnClickAnswerToSurvey: () => void;
}

function onClickAnswerToSurvey(payload: QuestionResult, dispatch: Dispatch<any>) {
  dispatch(ActionCreators.clickToAnswerInSurveyForm(payload));
}

const Answer: React.FC<AnswerProps> = React.memo(props => {
  return (
    <div className={styles.answerWrapper}>
      <label onClick={props.handleOnClickAnswerToSurvey}>
        <input type="radio" name={props.name} value={props.value} className={styles.answerRadioBtn} />
        <span className={styles.answerDesc}>{props.value}</span>
      </label>
    </div>
  );
});

const Question: React.FC<QuestionProps> = React.memo(({ context, qKey, dispatch }) => {
  const answers = context.answers.map((answer, index) => {
    const surveyPayload: QuestionResult = {
      surveyName: context.question,
      random: context.random,
      checked: {
        name: answer,
        order: index,
      },
    };
    return (
      <Answer
        value={answer}
        name={`q_${qKey}`}
        key={`q_${qKey}-a_${index}`}
        handleOnClickAnswerToSurvey={() => {
          onClickAnswerToSurvey(surveyPayload, dispatch);
        }}
      />
    );
  });
  return (
    <div className={styles.questionContainer}>
      <div className={styles.title}>{context.question}</div>
      <div className={styles.answersWrapper}>{answers}</div>
    </div>
  );
});

export default withStyles<typeof styles>(styles)(Question);
