import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '../../../../../helpers/withStylesHelper';
import { HOW_TO_FEEL_SURVEY, makeSurvey, AnswerParams, Survey } from '../../../../../helpers/surveyHelper';
import { AppState } from '../../../../../reducers';
import Question from './components/question';
import { getCurrentPageType } from '../../../../locationListener';
import ActionTicketManager from '../../../../../helpers/actionTicketManager';
import GlobalDialogManager from '../../../../../helpers/globalDialogManager';
const styles = require('./surveyForm.scss');

type Props = ReturnType<typeof mapStateToProps>;

function openFinalSignUpDialog(nextSignUpStep: string) {
  if (nextSignUpStep === 'email') {
    GlobalDialogManager.openFinalSignUpWithEmailDialog();
  } else {
    GlobalDialogManager.openFinalSignUpWithSocialDialog();
  }
}

function trackToSurveyAction(actionType: string, surveyResult: Survey) {
  ActionTicketManager.trackTicket({
    pageType: getCurrentPageType(),
    actionType: 'fire',
    actionArea: 'signUp',
    actionTag: actionType === 'submit' ? 'submitSurvey' : 'skipSurvey',
    actionLabel: JSON.stringify(surveyResult),
  });
}

const SurveyForm: React.FC<Props> = props => {
  const { DialogState } = props;
  const [survey, setSurvey] = React.useState(makeSurvey(HOW_TO_FEEL_SURVEY));
  const isActive = survey.questions.every(q => q.isFinished);

  function handleChange(answer: AnswerParams) {
    const targetQuestion = survey.questions[answer.questionIndex];
    if (targetQuestion.type === 'radio' || targetQuestion.type === 'input') {
      setSurvey({
        ...survey,
        questions: [
          ...survey.questions.slice(0, answer.questionIndex),
          { ...targetQuestion, answer: answer.answer as string, isFinished: true },
          ...survey.questions.slice(answer.questionIndex + 1),
        ],
      });
    }
  }

  const questionList = survey.questions.map((q, i) => (
    <Question questionIndex={i} onSelect={handleChange} question={q} key={i} />
  ));

  return (
    <div className={styles.surveyFormContainer}>
      <div className={styles.btnWrapper}>
        <div>{questionList}</div>
        <button
          className={classNames({
            [styles.activeSubmitBtn]: isActive,
            [styles.inActiveSubmitBtn]: !isActive,
          })}
          onClick={() => {
            trackToSurveyAction('submit', survey);
            openFinalSignUpDialog(DialogState.nextSignUpStep!);
          }}
          disabled={!isActive}
        >
          Submit
        </button>
        <button
          className={styles.skipBtn}
          onClick={() => {
            trackToSurveyAction('skip', survey);
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

export default connect(mapStateToProps)(withStyles<typeof SurveyForm>(styles)(SurveyForm));
