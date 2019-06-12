import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '../../../../../helpers/withStylesHelper';
import { SCINAPSE_SURVEY_QUESTIONS, Survey, RawQuestion, Q } from './constants';
import { AppState } from '../../../../../reducers';
import { getCurrentPageType } from '../../../../locationListener';
import Question from './components/question';
import ActionTicketManager from '../../../../../helpers/actionTicketManager';
import GlobalDialogManager from '../../../../../helpers/globalDialogManager';
const styles = require('./surveyForm.scss');

type Props = ReturnType<typeof mapStateToProps>;

function getReandomizedAnwsers(rawQuestion: Q) {
  const rawAnswers = rawQuestion.answers;
  const randomizedAnswers = {
    ...rawQuestion,
    answer: rawAnswers.sort(() => {
      return 0.5 - Math.random();
    }),
  };
  return randomizedAnswers;
}

function openFinalSignUpDialog(nextSignUpStep: string) {
  if (nextSignUpStep === 'email') {
    GlobalDialogManager.openFinalSignUpWithEmailDialog();
  } else {
    GlobalDialogManager.openFinalSignUpWithSocialDialog();
  }
}

function getAllSkippedSurveys() {
  const skippedSurveyQuestions = SCINAPSE_SURVEY_QUESTIONS.questions.map(question => {
    return { question: question.question };
  });

  return { surveyName: SCINAPSE_SURVEY_QUESTIONS.surveyName, questions: skippedSurveyQuestions };
}

function trackToSurveyAction(actionType: string, surveyResult?: RawQuestion) {
  ActionTicketManager.trackTicket({
    pageType: getCurrentPageType(),
    actionType: 'fire',
    actionArea: 'signUp',
    actionTag: actionType === 'submit' ? 'submitSurvey' : 'skipSurvey',
    actionLabel:
      actionType === 'submit' && surveyResult ? JSON.stringify(surveyResult) : JSON.stringify(getAllSkippedSurveys()),
  });
}

const SurveyForm: React.FC<Props> = props => {
  const { DialogState } = props;
  const [surveyResult, setSurveyResult] = React.useState<RawQuestion>();
  const [surveyQuestions, setSurveyQuestions] = React.useState<Survey>();
  const [isActive, setIsActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    const questions = SCINAPSE_SURVEY_QUESTIONS.questions.map(question => {
      return question.random ? getReandomizedAnwsers(question) : question;
    });

    setSurveyQuestions({ surveyName: SCINAPSE_SURVEY_QUESTIONS.surveyName, questions: questions });
  }, []);

  React.useEffect(
    () => {
      setIsActive(
        !!surveyQuestions &&
          surveyQuestions.questions.length > 0 &&
          surveyQuestions.questions.length === surveyResult!.questions.length
      );
    },
    [surveyResult]
  );

  const questionsList =
    !!surveyQuestions &&
    surveyQuestions.questions.map((surveyQuestion, index) => {
      return (
        <Question
          key={index}
          qKey={index}
          surveyName={SCINAPSE_SURVEY_QUESTIONS.surveyName}
          question={surveyQuestion}
          surveyResult={surveyResult}
          handleChangeAnswer={setSurveyResult}
        />
      );
    });

  return (
    <div className={styles.surveyFormContainer}>
      <div className={styles.btnWrapper}>
        <div>{questionsList}</div>
        <button
          className={classNames({
            [styles.activeSubmitBtn]: isActive,
            [styles.inActiveSubmitBtn]: !isActive,
          })}
          onClick={() => {
            trackToSurveyAction('submit', surveyResult);
            openFinalSignUpDialog(DialogState.nextSignUpStep!);
          }}
          disabled={!isActive}
        >
          Submit
        </button>
        <button
          className={styles.skipBtn}
          onClick={() => {
            trackToSurveyAction('skip');
            openFinalSignUpDialog(DialogState.nextSignUpStep!);
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    DialogState: state.dialog,
  };
}

export default connect(mapStateToProps)(withStyles<typeof styles>(styles)(SurveyForm));
