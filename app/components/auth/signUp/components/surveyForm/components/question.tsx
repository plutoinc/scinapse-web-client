import * as React from 'react';
import { findIndex, unionBy } from 'lodash';
import { RawQuestionType, Survey, SCINAPSE_SURVEY_NAME } from '../constants';
import { withStyles } from '../../../../../../helpers/withStylesHelper';
const styles = require('./question.scss');

interface QuestionProps {
  question: RawQuestionType;
  surveyResult: Survey;
  handleSetSurveyResult: (value: React.SetStateAction<Survey>) => void;
}

interface AnswerProps {
  value: string;
  name: string;
  type: string;
  handleCheckChange: () => void;
}

function changeSurveyAnswer(
  surveyPayload: Survey,
  type: string,
  surveyResult: Survey,
  handleSetSurveyResult: (value: React.SetStateAction<Survey>) => void
) {
  if (!surveyResult) {
    return handleSetSurveyResult(surveyPayload);
  }

  const questionPayload = surveyPayload.questions[0];
  const targetSurveyIndex = findIndex(surveyResult.questions, ['question', questionPayload.question]);

  if (targetSurveyIndex >= 0) {
    const targetSurvey = surveyResult.questions[targetSurveyIndex];

    if (type === 'checkbox') {
      const targetAnswerIndex = findIndex(targetSurvey.checked, questionPayload.checked[0]);
      const newSurveyResult = [
        ...surveyResult.questions.slice(0, targetSurveyIndex),
        {
          ...targetSurvey,
          checked:
            targetAnswerIndex >= 0
              ? [
                  ...targetSurvey.checked.slice(0, targetAnswerIndex),
                  ...targetSurvey.checked.slice(targetAnswerIndex + 1, targetSurvey.checked.length),
                ]
              : unionBy(targetSurvey.checked, questionPayload.checked, 'name'),
        },
        ...surveyResult.questions.slice(targetSurveyIndex + 1, surveyResult.questions.length),
      ];

      return handleSetSurveyResult({ surveyName: SCINAPSE_SURVEY_NAME, questions: newSurveyResult });
    } else {
      const newSurveyResult = [
        ...surveyResult.questions.slice(0, targetSurveyIndex),
        questionPayload,
        ...surveyResult.questions.slice(targetSurveyIndex + 1, surveyResult.questions.length),
      ];

      return handleSetSurveyResult({ surveyName: SCINAPSE_SURVEY_NAME, questions: newSurveyResult });
    }
  }

  return handleSetSurveyResult({
    surveyName: SCINAPSE_SURVEY_NAME,
    questions: [questionPayload, ...surveyResult.questions],
  });
}

const Answer: React.FC<AnswerProps> = props => {
  const { value, name, type, handleCheckChange } = props;
  return (
    <div className={styles.answerWrapper}>
      <label onChange={handleCheckChange}>
        <input type={type} name={name} value={value} className={styles.answerRadioBtn} />
        <span className={styles.answerDesc}>{value}</span>
      </label>
    </div>
  );
};

const Question: React.FC<QuestionProps> = props => {
  const { question, surveyResult, handleSetSurveyResult } = props;

  const answers = question.answers.map((answer, index) => {
    const surveyPayload: Survey = {
      surveyName: SCINAPSE_SURVEY_NAME,
      questions: [
        {
          question: question.question,
          random: question.random,
          checked: [
            {
              name: answer,
              order: index,
            },
          ],
        },
      ],
    };

    return (
      <Answer
        value={answer}
        name={question.question}
        key={index}
        type={question.type}
        handleCheckChange={() => {
          changeSurveyAnswer(surveyPayload, question.type, surveyResult, handleSetSurveyResult);
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
};

export default withStyles<typeof styles>(styles)(Question);
