import * as React from 'react';
import * as classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { shuffle } from 'lodash';
import { withStyles } from '../../../../../helpers/withStylesHelper';
import { SCINAPSE_SURVEY_QUESTIONS, Survey, AnswerToQuestion } from './constants';
import { AppState } from '../../../../../reducers';
import { getCurrentPageType } from '../../../../locationListener';
import { ActionCreators } from '../../../../../actions/actionTypes';
import Question from './components/question';
import ActionTicketManager from '../../../../../helpers/actionTicketManager';
import GlobalDialogManager from '../../../../../helpers/globalDialogManager';
import { SurveyTicketFormatter } from './helpers/SurveyTicketManager';
const styles = require('./surveyForm.scss');

type Props = ReturnType<typeof mapStateToProps> & { dispatch: Dispatch<any> };

function randomizedAnswers(defaultQuestion: Survey) {
  const defaultAnswers = defaultQuestion.answers;
  const randomizedAnswersSurveyContext = {
    ...defaultQuestion,
    answer: shuffle(defaultAnswers),
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

function getAllSurveyName() {
  const surveyNames = SCINAPSE_SURVEY_QUESTIONS.map(survey => {
    return { surveyName: survey.surveyName, question: survey.question };
  });

  return surveyNames;
}

function getSurveyActionTracker(actionType: string, surveyResult?: AnswerToQuestion[]) {
  ActionTicketManager.trackTicket({
    pageType: getCurrentPageType(),
    actionType: 'fire',
    actionArea: 'signUp',
    actionTag: actionType === 'submit' ? 'submitSurvey' : 'skipSurvey',
    actionLabel:
      actionType === 'submit' && surveyResult
        ? SurveyTicketFormatter(surveyResult)
        : SurveyTicketFormatter(getAllSurveyName()),
  });
}

const SurveyForm: React.FC<Props> = props => {
  const { SurveyFormState, dispatch, DialogState } = props;
  const [surveyQuestions, setSurveyQuestions] = React.useState<Survey[]>([]);
  const [isActive, setIsActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    const questions = SCINAPSE_SURVEY_QUESTIONS.map(question => {
      return question.random ? randomizedAnswers(question) : question;
    });

    setSurveyQuestions(questions);
  }, []);

  React.useEffect(
    () => {
      setIsActive(surveyQuestions.length > 0 && surveyQuestions.length === SurveyFormState.surveyResult.length);
    },
    [SurveyFormState.surveyResult]
  );

  const questionsList = surveyQuestions.map((surveyQuestion, index) => {
    return <Question key={index} qKey={index} question={surveyQuestion} dispatch={dispatch} />;
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
            getSurveyActionTracker('submit', SurveyFormState.surveyResult);
            dispatch(ActionCreators.submitToSurvey());
            openFinalSignUpDialog(DialogState.nextSignUpStep!);
          }}
          disabled={!isActive}
        >
          Submit
        </button>
        <button
          className={styles.skipBtn}
          onClick={() => {
            getSurveyActionTracker('skip');
            dispatch(ActionCreators.skipToSurvey());
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
    SurveyFormState: state.surveyFormState,
    DialogState: state.dialog,
  };
}

export default connect(mapStateToProps)(withStyles<typeof styles>(styles)(SurveyForm));
