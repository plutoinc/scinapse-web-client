import * as React from 'react';
import { withStyles } from '../../../../../helpers/withStylesHelper';
import { SCINAPSE_SURVEY_QUESTIONS, SurveyType } from './constants';
import Question from './components/question';
import { AppState } from '../../../../../reducers';
import { connect } from 'react-redux';
import { SurveyFormState } from '../../../../../reducers/surveyForm';
import { Dispatch } from 'redux';
import ActionTicketManager from '../../../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../../../locationListener';
import * as classNames from 'classnames';
import { ActionCreators } from '../../../../../actions/actionTypes';
import { DialogState } from '../../../../dialog/reducer';
import GlobalDialogManager from '../../../../../helpers/globalDialogManager';
const styles = require('./surveyForm.scss');

interface SurveyFormProps {
  SurveyFormState: SurveyFormState;
  DialogState: DialogState;
  dispatch: Dispatch<any>;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ SurveyFormState, dispatch, DialogState }) => {
  const [surveyQuestions, setSurveyQuestions] = React.useState<SurveyType[]>();

  React.useEffect(() => {
    const questions = SCINAPSE_SURVEY_QUESTIONS.map(question => {
      if (question.random) {
        const defaultAnswers = question.answers;
        const randomizedOrderAnswerSurvey = {
          ...question,
          answer: defaultAnswers.sort(() => {
            return 0.5 - Math.random();
          }),
        };
        return randomizedOrderAnswerSurvey;
      }
      return question;
    });
    setSurveyQuestions(questions);
  }, []);

  const questionsList =
    surveyQuestions &&
    surveyQuestions.map((question, index) => {
      return <Question key={index} qKey={index} context={question} dispatch={dispatch} />;
    });

  return (
    <div className={styles.surveyFormContainer}>
      <div className={styles.btnWrapper}>
        <div>{questionsList}</div>
        <button
          className={classNames({
            [styles.activeSubmitBtn]: surveyQuestions && surveyQuestions.length === SurveyFormState.surveyResult.length,
            [styles.inActiveSubmitBtn]:
              surveyQuestions && surveyQuestions.length !== SurveyFormState.surveyResult.length,
          })}
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType: getCurrentPageType(),
              actionType: 'fire',
              actionArea: 'surveyForm',
              actionTag: 'submitSurvey',
              actionLabel: JSON.stringify(SurveyFormState.surveyResult),
            });
            dispatch(ActionCreators.submitToSurvey());
            DialogState.nextSignUpStep && DialogState.nextSignUpStep === 'email'
              ? GlobalDialogManager.openFinalSignUpWithEmailDialog()
              : GlobalDialogManager.openFinalSignUpWithSocialDialog();
          }}
          disabled={surveyQuestions && surveyQuestions.length !== SurveyFormState.surveyResult.length}
        >
          Submit
        </button>
        <button
          className={styles.skipBtn}
          onClick={() => {
            DialogState.nextSignUpStep && DialogState.nextSignUpStep === 'email'
              ? GlobalDialogManager.openFinalSignUpWithEmailDialog()
              : GlobalDialogManager.openFinalSignUpWithSocialDialog();
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
