import * as React from 'react';
import * as Cookies from 'js-cookie';
import * as classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Formik, FormikErrors, Form, Field } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FeedbackManager from '@pluto_network/scinapse-feedback';
import Dialog from '@material-ui/core/Dialog';
import { CurrentUser } from '../../../../model/currentUser';
import { withStyles } from '../../../../helpers/withStylesHelper';
import { AppState } from '../../../../reducers';
import validateEmail from '../../../../helpers/validateEmail';
import ScinapseFormikInput from '../../../common/scinapseInput/scinapseFormikInput';
import ReduxAutoSizeTextarea from '../../../common/autoSizeTextarea/reduxAutoSizeTextarea';
import { ACTION_TYPES } from '../../../../actions/actionTypes';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import Icon from '../../../../icons';
import { LAST_SUCCEEDED_EMAIL_KEY } from '../../../../constants/requestDialogConstant';
import { FEEDBACK_SOURCE, FEEDBACK_PRIORITY, FEEDBACK_STATUS } from '../../../../constants/feedback';

const styles = require('./requestPaperDialog.scss');

interface RequestPaperDialogProps extends RouteComponentProps<any> {
  isOpen: boolean;
  onClose: () => void;
  query: string | null;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

interface FormState {
  email: string;
  content: string;
}

function validateForm(values: FormState) {
  const errors: FormikErrors<FormState> = {};
  if (!validateEmail(values.email)) {
    errors.email = 'Please enter valid e-mail address.';
  }
  return errors;
}

const RequestPaperDialog: React.FunctionComponent<RequestPaperDialogProps> = props => {
  const { currentUser, isOpen, onClose, dispatch, query } = props;
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmitForm(values: FormState) {
    setIsLoading(true);

    const feedbackManager = new FeedbackManager();
    const feedbackDesc = `query : ${query} / comment : ${values.content}`;

    try {
      await feedbackManager.sendTicketToFreshdesk({
        email: values.email,
        description: feedbackDesc,
        subject: 'Not include paper : ' + values.email,
        status: FEEDBACK_STATUS.OPEN,
        priority: FEEDBACK_PRIORITY.MEDIUM,
        source: FEEDBACK_SOURCE.EMAIL,
      });

      ActionTicketManager.trackTicket({
        pageType: 'searchResult',
        actionType: 'fire',
        actionArea: 'noPaperNotiPage',
        actionTag: 'sendRequestPaper',
        actionLabel: query,
      });

      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'success',
          message: 'Sent request successfully.',
        },
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert(err);
    }
    setIsLoading(false);
  }

  React.useEffect(
    () => {
      if (currentUser.isLoggedIn) {
        setEmail(currentUser.email);
      } else {
        setEmail(Cookies.get(LAST_SUCCEEDED_EMAIL_KEY) || '');
      }
    },
    [currentUser.isLoggedIn]
  );

  return (
    <Dialog open={isOpen} onClose={onClose} classes={{ paper: styles.dialogPaper }}>
      <div className={styles.title}>Request Paper</div>
      <div className={styles.subtitle}>
        We will send you a checked paper by sending a request to the authors instead.
      </div>

      <Formik
        initialValues={{ email, content: '' }}
        validate={validateForm}
        onSubmit={handleSubmitForm}
        enableReinitialize
        render={({ errors }) => (
          <Form className={styles.form}>
            <label htmlFor="email" className={styles.label}>
              YOUR EMAIL*
            </label>
            <Field
              name="email"
              type="email"
              className={classNames({
                [styles.emailInput]: true,
                [styles.emailInputError]: !!errors.email,
              })}
              placeholder="ex) researcher@university.com"
              component={ScinapseFormikInput}
            />
            <label htmlFor="content" className={styles.contentLabel}>
              ADD YOUR MESSAGE (Optional)
            </label>
            <Field
              name="content"
              component={ReduxAutoSizeTextarea}
              textareaClassName={styles.textAreaWrapper}
              textareaStyle={{ padding: '8px' }}
              rows={3}
              placeholder="Add the URL(web address), DOI, or the citation sentence of the paper to be included."
            />
            <div className={styles.btnWrapper}>
              <button className={styles.cancelBtn} type="button" onClick={onClose}>
                cancel
              </button>
              <button disabled={isLoading} className={styles.submitBtn} type="submit">
                <Icon icon="SEND" className={styles.sendIcon} />
                Send
              </button>
            </div>
          </Form>
        )}
      />
    </Dialog>
  );
};

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof RequestPaperDialog>(styles)(RequestPaperDialog)));
