import * as React from 'react';
import * as Cookies from 'js-cookie';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import { Formik, Form, Field, FormikErrors } from 'formik';
import PaperAPI from '../../../api/paper';
import { AppState } from '../../../reducers';
import { CurrentUser } from '../../../model/currentUser';
import validateEmail from '../../../helpers/validateEmail';
import { withStyles } from '../../../helpers/withStylesHelper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import ScinapseFormikInput from '../../../components/common/scinapseInput/scinapseFormikInput';
import ReduxAutoSizeTextarea from '../../../components/common/autoSizeTextarea/reduxAutoSizeTextarea';
import Icon from '../../../icons';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import { LAST_SUCCEEDED_EMAIL_KEY } from '../../../constants/requestDialogConstant';
import { fetchLastFullTextRequestedDate } from '../../../actions/paperShow';
const s = require('./fullTextDialog.scss');

interface RequestFullTextProps {
  isOpen: boolean;
  paperId: number;
  onClose: () => void;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

interface FormState {
  email: string;
  message: string;
}

function validateForm(values: FormState) {
  const errors: FormikErrors<FormState> = {};
  if (!validateEmail(values.email)) {
    errors.email = 'Please enter valid e-mail address.';
  }
  return errors;
}

const RequestFullText: React.FunctionComponent<RequestFullTextProps> = props => {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmitForm(values: FormState) {
    setIsLoading(true);
    try {
      await PaperAPI.requestFullText({
        paperId: props.paperId,
        email: values.email,
        message: values.message,
        name: `${props.currentUser.firstName} ${props.currentUser.lastName}`,
      });

      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
        actionType: 'fire',
        actionArea: 'paperDescription',
        actionTag: 'sendRequestFullText',
        actionLabel: String(props.paperId),
      });

      Cookies.set(LAST_SUCCEEDED_EMAIL_KEY, values.email);
      props.dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'success',
          message: 'Sent request successfully.',
        },
      });
      props.dispatch(fetchLastFullTextRequestedDate(props.paperId));
      props.onClose();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  React.useEffect(
    () => {
      if (props.currentUser.isLoggedIn) {
        setEmail(props.currentUser.email);
      } else {
        setEmail(Cookies.get(LAST_SUCCEEDED_EMAIL_KEY) || '');
      }
    },
    [props.currentUser.isLoggedIn]
  );

  return (
    <Dialog open={props.isOpen} onClose={props.onClose} classes={{ paper: s.dialogPaper }}>
      <div className={s.title}>Request Full-text</div>
      <div className={s.subtitle}>
        This is not automated. We’re trying to contact authors when many requests are accepted.<br />
        The notification will be sent when full-text is updated.
      </div>

      <Formik
        initialValues={{ email, message: '' }}
        validate={validateForm}
        onSubmit={handleSubmitForm}
        enableReinitialize
        render={({ errors }) => (
          <Form className={s.form}>
            <label htmlFor="email" className={s.label}>
              YOUR EMAIL*
            </label>
            <Field
              name="email"
              type="email"
              className={classNames({
                [s.emailInput]: true,
                [s.emailInputError]: !!errors.email,
              })}
              placeholder="ex) researcher@university.com"
              component={ScinapseFormikInput}
            />
            <label htmlFor="message" className={s.messageLabel}>
              ADD YOUR MESSAGE (Optional)
            </label>
            <Field
              name="message"
              component={ReduxAutoSizeTextarea}
              textareaClassName={s.textAreaWrapper}
              textareaStyle={{ padding: '8px' }}
              rows={3}
              placeholder="ex) I'm interested in this paper - Could you provide the full-text for it?"
            />
            <div className={s.btnWrapper}>
              <button className={s.cancelBtn} type="button" onClick={props.onClose}>
                Cancel
              </button>
              <button disabled={isLoading} className={s.submitBtn} type="submit">
                <Icon icon="SEND" className={s.sendIcon} />
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

export default connect(mapStateToProps)(withStyles<typeof RequestFullText>(s)(RequestFullText));
