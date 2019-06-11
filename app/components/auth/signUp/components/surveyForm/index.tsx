import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '../../../../../helpers/withStylesHelper';
import { SCINAPSE_SURVEY_QUESTIONS, Survey, RawQuestion } from './constants';
import { AppState } from '../../../../../reducers';
import { getCurrentPageType } from '../../../../locationListener';
import Question from './components/question';
import ActionTicketManager from '../../../../../helpers/actionTicketManager';
import GlobalDialogManager from '../../../../../helpers/globalDialogManager';
import { SurveyTicketFormatter as SurveyTicketContextFormatter } from './helpers/SurveyTicketManager';
const styles = require('./surveyForm.scss');

type Props = ReturnType<typeof mapStateToProps>;

function generateRandomizedAnswers(rawQuestion: Survey) {
  const rawAnswers = rawQuestion.answers;
  const randomizedAnswersSurveyContext = {
    ...rawQuestion,
    answer: rawAnswers.sort(() => {
      return 0.5 - Math.random();
    }),
  };
  return randomizedAnswersSurveyContext;
}

function openFinalSignUpDialog(nextSignUpStep: string) {
  if (nextSignUpStep === 'email') {
    GlobalDialogManager.openFinalSignUpWithEmailDialog();
  } else {
    GlobalDialogManager.openFinalSignUpWithSocialDialog();
  }
}

function getSkippedSurveyInfo() {
  const skippedSurveyInfo = SCINAPSE_SURVEY_QUESTIONS.map(survey => {
    return { surveyName: survey.surveyName, question: survey.question };
  });

  return skippedSurveyInfo;
}

function trackToSurveyAction(actionType: string, surveyResult?: RawQuestion[]) {
  ActionTicketManager.trackTicket({
    pageType: getCurrentPageType(),
    actionType: 'fire',
    actionArea: 'signUp',
    actionTag: actionType === 'submit' ? 'submitSurvey' : 'skipSurvey',
    actionLabel:
      actionType === 'submit' && surveyResult
        ? SurveyTicketContextFormatter(surveyResult)
        : SurveyTicketContextFormatter(getSkippedSurveyInfo()),
  });
}

const SurveyForm: React.FC<Props> = props => {
  const { DialogState } = props;
  const [surveyResult, setSurveyResult] = React.useState<RawQuestion[]>([]);
  const [surveyQuestions, setSurveyQuestions] = React.useState<Survey[]>([]);
  const [isActive, setIsActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    const questions = SCINAPSE_SURVEY_QUESTIONS.map(question => {
      return question.random ? generateRandomizedAnswers(question) : question;
    });

    setSurveyQuestions(questions);
  }, []);

  React.useEffect(
    () => {
      setIsActive(surveyQuestions.length > 0 && surveyQuestions.length === surveyResult.length);
    },
    [surveyResult]
  );

  const questionsList = surveyQuestions.map((surveyQuestion, index) => {
    return (
      <Question
        key={index}
        qKey={index}
        question={surveyQuestion}
        surveyResult={surveyResult}
        onChangeSetSurveyResult={setSurveyResult}
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
            console.log(surveyResult);
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
