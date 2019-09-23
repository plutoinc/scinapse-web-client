import * as React from 'react';
import * as Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import * as classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import { Formik, Form, Field, FormikErrors } from 'formik';
import PaperAPI from '../../../api/paper';
import { AppState } from '../../../reducers';
import validateEmail from '../../../helpers/validateEmail';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import ScinapseFormikInput from '../../../components/common/scinapseInput/scinapseFormikInput';
import Icon from '../../../icons';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import { LAST_SUCCEEDED_EMAIL_KEY } from '../../../constants/requestDialogConstant';
import { fetchLastFullTextRequestedDate } from '../../../actions/paperShow';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./fullTextDialog.scss');

interface RequestFullTextProps {
  isOpen: boolean;
  paperId: number;
  onClose: () => void;
}

type FormState = ReturnType<typeof getInitialValues>;

function validateForm(values: FormState) {
  const errors: FormikErrors<FormState> = {};
  if (!validateEmail(values.email)) {
    errors.email = 'Please enter valid e-mail address.';
    return errors;
  }

  Object.keys(values).forEach((formKey: keyof FormState) => {
    if (!values[formKey]) {
      errors[formKey] = 'Please fill the content';
    }
  });

  return errors;
}

function getInitialValues(email?: string) {
  return {
    email: email || '',
    interest: '',
    whoami: '',
    important: '',
    profileLink: '',
  };
}

function buildMessage(values: FormState) {
  return `
  Interesting point:
  ${values.interest}

  Who am I:
  ${values.whoami}

  How important to you:
  ${values.important}
  
  Your profile link:
  ${values.profileLink}
  `;
}

const RequestFullText: React.FunctionComponent<RequestFullTextProps> = props => {
  useStyles(s);
  const dispatch = useDispatch();
  const currentUser = useSelector((appState: AppState) => appState.currentUser);
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmitForm(values: FormState) {
    setIsLoading(true);

    const message = buildMessage(values);
    console.log(message);

    try {
      await PaperAPI.requestFullText({
        paperId: props.paperId,
        email: values.email,
        message,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
      });

      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
        actionType: 'fire',
        actionArea: 'paperDescription',
        actionTag: 'sendRequestFullText',
        actionLabel: String(props.paperId),
      });

      Cookies.set(LAST_SUCCEEDED_EMAIL_KEY, values.email);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'success',
          message: 'Sent request successfully.',
        },
      });
      dispatch(fetchLastFullTextRequestedDate(props.paperId));
      props.onClose();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={props.isOpen} onClose={props.onClose} classes={{ paper: s.dialogPaper }}>
      <div className={s.title}>Request Full-text</div>
      <div className={s.subtitle}>
        This is not automated. We’re trying to contact authors when many requests are accepted.<br />
        The notification will be sent when full-text is updated.
      </div>

      <Formik
        initialValues={getInitialValues(currentUser.email)}
        validate={validateForm}
        onSubmit={handleSubmitForm}
        enableReinitialize
        render={({ errors }) => (
          <Form className={s.form}>
            <div className={s.inputWrapper}>
              <label htmlFor="email" className={s.label}>
                Email*
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
            </div>
            <div className={s.inputWrapper}>
              <label htmlFor="interest" className={s.label}>
                Interesting points*
              </label>
              <Field
                name="interest"
                type="text"
                className={classNames({
                  [s.emailInput]: true,
                  [s.emailInputError]: !!errors.interest,
                })}
                component={ScinapseFormikInput}
              />
            </div>
            <div className={s.inputWrapper}>
              <label htmlFor="whoami" className={s.label}>
                Who am I?*
              </label>
              <Field
                name="whoami"
                type="text"
                className={classNames({
                  [s.emailInput]: true,
                  [s.emailInputError]: !!errors.whoami,
                })}
                component={ScinapseFormikInput}
              />
            </div>
            <div className={s.inputWrapper}>
              <label htmlFor="important" className={s.label}>
                How important to you?*
              </label>
              <Field
                name="important"
                type="text"
                className={classNames({
                  [s.emailInput]: true,
                  [s.emailInputError]: !!errors.important,
                })}
                component={ScinapseFormikInput}
              />
            </div>
            <div className={s.inputWrapper}>
              <label htmlFor="profileLink" className={s.label}>
                Your profile link*
              </label>
              <Field
                name="profileLink"
                type="text"
                className={classNames({
                  [s.emailInput]: true,
                  [s.emailInputError]: !!errors.profileLink,
                })}
                component={ScinapseFormikInput}
              />
            </div>
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

export default RequestFullText;
