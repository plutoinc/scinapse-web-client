import * as React from 'react';
import * as Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import * as classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import { Formik, Form, Field, FormikErrors } from 'formik';
import PaperAPI from '../../api/paper';
import { AppState } from '../../reducers';
import validateEmail from '../../helpers/validateEmail';
import ActionTicketManager from '../../helpers/actionTicketManager';
import ScinapseFormikInput from '../common/scinapseInput/scinapseFormikInput';
import ReduxAutoSizeTextarea from '../common/autoSizeTextarea/reduxAutoSizeTextarea';
import Icon from '../../icons';
import { ACTION_TYPES } from '../../actions/actionTypes';
import { LAST_SUCCEEDED_EMAIL_KEY } from '../../constants/requestDialogConstant';
import { fetchLastFullTextRequestedDate } from '../../actions/paperShow';
import { openRecommendPoolDialog } from '../recommendPool/recommendPoolActions';
import { closeRequestFullTextDialog } from '../../reducers/requestFullTextDialog';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./fullTextDialog.scss');

interface RequestFullTextProps {
  paperId: number;
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
  useStyles(s);
  const dispatch = useDispatch();
  const { currentUser, isOpen, openFrom } = useSelector((appState: AppState) => ({
    currentUser: appState.currentUser,
    isOpen: appState.requestFullTextDialogState.isOpen,
    openFrom: appState.requestFullTextDialogState.from,
  }));
  const [isLoading, setIsLoading] = React.useState(false);
  const actionArea = openFrom === 'refCited' ? 'requestFullTextBtnAtRefBar' : 'requestFullTextBtn';

  function handleClose() {
    dispatch(openRecommendPoolDialog('paperShow', actionArea));
    dispatch(closeRequestFullTextDialog());
  }

  async function handleSubmitForm(values: FormState) {
    setIsLoading(true);
    try {
      await PaperAPI.requestFullText({
        paperId: props.paperId,
        email: values.email,
        message: values.message,
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
      handleClose();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} classes={{ paper: s.dialogPaper }}>
      <div className={s.title}>Request Full-text</div>
      <div className={s.subtitle}>
        This is not automated. We’re trying to contact authors when many requests are accepted.<br />
        The notification will be sent when full-text is updated.
      </div>

      <Formik
        initialValues={{ email: currentUser.email || '', message: '' }}
        validate={validateForm}
        onSubmit={handleSubmitForm}
        enableReinitialize
        validateOnChange={false}
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
              <button className={s.cancelBtn} type="button" onClick={handleClose}>
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
