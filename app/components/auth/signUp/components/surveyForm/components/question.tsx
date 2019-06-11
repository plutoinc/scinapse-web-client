import * as React from 'react';
import { Dispatch } from 'redux';
import { Survey, RawQuestion } from '../constants';
import { withStyles } from '../../../../../../helpers/withStylesHelper';
import { ActionCreators } from '../../../../../../actions/actionTypes';
const styles = require('./question.scss');

interface QuestionProps {
  question: Survey;
  qKey: number;
  dispatch: Dispatch<any>;
}

interface AnswerProps {
  value: string;
  name: string;
  type: string;
  handleChangeAnswerToQuestion: () => void;
}

function onChangeAnswerToQuestion(survey: RawQuestion, type: string, dispatch: Dispatch<any>) {
  dispatch(ActionCreators.clickToAnswerInSurveyForm({ survey, type }));
}

const Answer: React.FC<AnswerProps> = React.memo(props => {
  return (
    <div className={styles.answerWrapper}>
      <label onChange={props.handleChangeAnswerToQuestion}>
        <input type={props.type} name={props.name} value={props.value} className={styles.answerRadioBtn} />
        <span className={styles.answerDesc}>{props.value}</span>
      </label>
    </div>
  );
});

const Question: React.FC<QuestionProps> = React.memo(props => {
  const { question, qKey, dispatch } = props;
  const answers = question.answers.map((answer, index) => {
    const surveyPayload: RawQuestion = {
      surveyName: question.surveyName,
      question: question.question,
      random: question.random,
      checked: [
        {
          name: answer,
          order: index,
        },
      ],
    };

    return (
      <Answer
        value={answer}
        name={`q_${qKey}`}
        key={`q_${qKey}-a_${index}`}
        type={question.type}
        handleChangeAnswerToQuestion={() => {
          onChangeAnswerToQuestion(surveyPayload, question.type, dispatch);
        }}
      />
    );
  });

  return (
    <div className={styles.questionContainer}>
      <div className={styles.title}>{question.question}</div>
      <div className={styles.answersWrapper}>{answers}</div>
    </div>
  );
});

export default withStyles<typeof styles>(styles)(Question);
