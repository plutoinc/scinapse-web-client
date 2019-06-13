import * as React from 'react';
import { findIndex } from 'lodash';
import { QuestionType, Survey, SCINAPSE_SURVEY_NAME, CheckedAnswer } from '../constants';
import { withStyles } from '../../../../../../helpers/withStylesHelper';
const styles = require('./question.scss');

interface QuestionProps {
  question: QuestionType;
  surveyResult: Survey;
  handleSetSurveyResult: (value: React.SetStateAction<Survey>) => void;
}

interface AnswerProps {
  name: string;
  value?: string;
  type?: string;
  handleChangeSelected?: () => void;
  handleSetAnswers?: (value: React.SetStateAction<CheckedAnswer[]>) => void;
}

function handleChangeObjectiveAnswers(
  type: string,
  checkedAnswer: CheckedAnswer,
  answers: CheckedAnswer[],
  handleSetAnswers: (value: React.SetStateAction<CheckedAnswer[]>) => void
) {
  const targetIndex = findIndex(answers, checkedAnswer);
  if (type === 'checkbox') {
    targetIndex >= 0
      ? handleSetAnswers([...answers.slice(0, targetIndex), ...answers.slice(targetIndex + 1, answers.length)])
      : handleSetAnswers([...answers, checkedAnswer]);
  } else {
    handleSetAnswers([checkedAnswer]);
  }
}

function handleChangeSubjectiveAnswer(
  newAnswer: string,
  handleSetAnswers: (value: React.SetStateAction<CheckedAnswer[]>) => void
) {
  handleSetAnswers([{ name: newAnswer, order: 0 }]);
}

const ObjectiveAnswer: React.FC<AnswerProps> = props => {
  const { value, name, type, handleChangeSelected } = props;
  return (
    <div className={styles.answerWrapper}>
      <label onChange={handleChangeSelected}>
        <input type={type} name={name} value={value} className={styles.answerRadioBtn} />
        <span className={styles.answerDesc}>{value}</span>
      </label>
    </div>
  );
};

const SubjectiveAnswer: React.FC<AnswerProps> = props => {
  const [subjectiveAnswer, setSubjectiveAnswer] = React.useState<string>('');
  const { name, handleSetAnswers } = props;
  return (
    <div className={styles.answerWrapper}>
      <label>
        <input
          type="text"
          name={name}
          value={subjectiveAnswer}
          className={styles.answerRadioBtn}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            handleChangeSubjectiveAnswer(e.currentTarget.value, handleSetAnswers!);
            setSubjectiveAnswer(e.currentTarget.value);
          }}
        />
      </label>
    </div>
  );
};

const Question: React.FC<QuestionProps> = props => {
  const { question, surveyResult, handleSetSurveyResult } = props;
  const [answers, setAnswers] = React.useState<CheckedAnswer[]>([]);

  React.useEffect(
    () => {
      const newQuestionAnswer = { question: question.question, random: question.random, checked: answers };

      if (!surveyResult) {
        return handleSetSurveyResult({
          surveyName: SCINAPSE_SURVEY_NAME,
          questions: [newQuestionAnswer],
        });
      }

      const targetIndex = findIndex(surveyResult.questions, ['question', question.question]);
      return targetIndex >= 0
        ? handleSetSurveyResult({
            ...surveyResult,
            questions: [
              ...surveyResult.questions.slice(0, targetIndex),
              newQuestionAnswer,
              ...surveyResult.questions.slice(targetIndex + 1, surveyResult.questions.length),
            ],
          })
        : handleSetSurveyResult({
            ...surveyResult,
            questions: [...surveyResult.questions, newQuestionAnswer],
          });
    },
    [answers]
  );

  const answersList = question.answers!.map((answer, index) => {
    const answerPayload: CheckedAnswer = {
      name: answer,
      order: index,
    };

    return question.type && question.type !== 'text' ? (
      <ObjectiveAnswer
        value={answer}
        name={question.question}
        key={index}
        type={question.type}
        handleChangeSelected={() => {
          handleChangeObjectiveAnswers(question.type!, answerPayload, answers, setAnswers);
        }}
      />
    ) : (
      <SubjectiveAnswer name={question.question} key={index} handleSetAnswers={setAnswers} />
    );
  });

  return (
    <div className={styles.questionContainer}>
      <div className={styles.title}>{question.question}</div>
      <div className={styles.answersWrapper}>{answersList}</div>
    </div>
  );
};

export default withStyles<typeof styles>(styles)(Question);
