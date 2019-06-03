import * as React from 'react';
import { Field, Formik, Form } from 'formik';
import { Dispatch, connect } from 'react-redux';
import AuthButton from '../authButton';
import AuthInputBox from '../../common/inputBox/authInputBox';
import { withStyles } from '../../../helpers/withStylesHelper';
import validateEmail from '../../../helpers/validateEmail';
import { changeDialogType } from '../../dialog/actions';
import { GLOBAL_DIALOG_TYPE } from '../../dialog/reducer';
import AuthAPI from '../../../api/auth';
import Icon from '../../../icons';
const styles = require('./resetPassword.scss');

interface ResetPasswordProps
  extends Readonly<{
      handleCloseDialogRequest: () => void;
      dispatch: Dispatch<any>;
    }> {}

function getFinishedContent() {
  return (
    <div className={styles.successBox}>
      <div className={styles.verificationEmailIconWrapper}>
        <Icon icon="VERIFICATION_EMAIL_ICON" />
      </div>
      <div className={styles.successTitle}>Sent reset password Email!</div>
      <div className={styles.successSubtitle}>
        <div>We've just emailed you instructions on</div>
        <div>how to reset your password.</div>
      </div>
    </div>
  );
}

const validateEmailField = (email: string) => {
  if (!validateEmail(email)) {
    return 'E-mail is invalid';
  }
};

const ResetPasswordContainer: React.FunctionComponent<ResetPasswordProps> = props => {
  const { handleCloseDialogRequest } = props;

  const [isFinished, setIsFinished] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(email: string) {
    try {
      setIsLoading(true);
      await AuthAPI.requestResetPasswordToken(email);
      setIsLoading(false);
      setIsFinished(true);
    } catch (err) {
      setIsLoading(false);
      console.error(err.message);
    }
  }

  function handleClickGoBackButton() {
    const { dispatch } = props;

    dispatch(changeDialogType(GLOBAL_DIALOG_TYPE.SIGN_IN));
  }

  return (
    <div className={styles.resetPasswordContainer}>
      <div onClick={handleCloseDialogRequest} className={styles.closeButtonWrapper}>
        <Icon icon="X_BUTTON" className={styles.closeButtonIcon} />
      </div>
      <div className={styles.dialogTitle}>FORGOT YOUR PASSWORD?</div>
      <div className={styles.dialogSubtitle}>We'll email you instruction about how to reset it.</div>
      {isFinished ? (
        getFinishedContent()
      ) : (
        <Formik
          initialValues={''}
          onSubmit={handleSubmit}
          render={() => {
            return (
              <Form className={styles.formContainer}>
                <Field
                  validate={validateEmailField}
                  name="email"
                  type="email"
                  component={AuthInputBox}
                  placeholder="E-mail"
                  iconName="EMAIL_ICON"
                  wrapperStyles={{ width: '100%' }}
                />
                <AuthButton
                  type="submit"
                  isLoading={isLoading}
                  text="RESET PASSWORD"
                  style={{ backgroundColor: '#6096ff', marginTop: '42px', fontSize: '14px' }}
                />
                <AuthButton
                  isLoading={isLoading}
                  text="GO BACK"
                  onClick={() => {
                    handleClickGoBackButton();
                  }}
                  style={{ backgroundColor: '#e7eaef', marginTop: '10px', marginBottom: '42px', fontSize: '14px' }}
                />
              </Form>
            );
          }}
        />
      )}
    </div>
  );
};

export default connect()(withStyles<typeof ResetPasswordContainer>(styles)(ResetPasswordContainer));
