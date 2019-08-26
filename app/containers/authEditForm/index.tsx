import React, { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Field, Form, Formik, FormikErrors, FormikTouched } from 'formik';
import { withStyles } from '../../helpers/withStylesHelper';
import { AppState } from '../../reducers';
import { ACTION_TYPES, AlertAction, AuthActions } from '../../actions/actionTypes';
import { MINIMUM_PASSWORD_LENGTH } from '../../constants/auth';
import { changePassword } from '../../actions/auth';
import AuthAPI from '../../api/auth';
import PlutoAxios from '../../api/pluto';

const s = require('./authEditForm.scss');

interface AuthEditFormValues {
  email: string;
  oldPassword: string;
  newPassword: string;
}

const validateForm = (values: AuthEditFormValues) => {
  const errors: Partial<AuthEditFormValues> = {};

  if (!values.oldPassword) {
    errors.oldPassword = 'Please enter old password.';
  }

  if (values.newPassword.length < MINIMUM_PASSWORD_LENGTH) {
    errors.newPassword = 'Must have at least 8 characters.';
  }

  return errors;
};

const ErrorMessage: React.FC<{ errorMsg?: string }> = ({ errorMsg }) => {
  if (!errorMsg) return null;

  return <div className={s.errorMsg}>{errorMsg}</div>;
};

interface EmailFieldProps {
  email: string;
  userVerified: boolean;
  hasError: boolean;
  editMode: boolean;
  errorMsg: string | undefined;
  onClickResendButton: () => void;
}
const EmailField: React.FC<EmailFieldProps> = ({ email, editMode, userVerified, errorMsg, onClickResendButton }) => {
  if (!userVerified) {
    return (
      <>
        <div className={s.emailFieldWrapper}>
          <input className={s.readOnlyInput} type="email" value={email} placeholder="EMAIL" disabled />
          <div className={s.toggleButton} onClick={onClickResendButton}>
            Resend Mail
          </div>
        </div>
        <ErrorMessage errorMsg="You are not verified yet. Please check your email to use." />
      </>
    );
  }

  return (
    <>
      <div className={s.emailFieldWrapper}>
        <Field
          className={classNames({
            [s.readOnlyInput]: true,
          })}
          name="email"
          placeholder="EMAIL"
          disabled={!editMode}
        />
      </div>
      <ErrorMessage errorMsg={errorMsg} />
    </>
  );
};

interface PasswordFieldProps {
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  isSocialUser: boolean;
  errors: FormikErrors<AuthEditFormValues>;
  touched: FormikTouched<AuthEditFormValues>;
}
const PasswordField: React.FC<PasswordFieldProps> = ({
  isSocialUser,
  errors,
  touched,
  isLoading,
  editMode,
  setEditMode,
}) => {
  if (isSocialUser) {
    return (
      <div className={s.formWrapper}>
        <label className={s.formLabel}>SOCIAL ACCOUNT</label>
      </div>
    );
  }

  if (!editMode) {
    return (
      <div className={s.formWrapper}>
        <label className={s.formLabel}>PASSWORD</label>
        <div className={s.emailFieldWrapper}>
          <input type="password" className={s.inputForm} value="********" placeholder="Password" disabled />
          <div
            className={s.toggleButton}
            onClick={() => {
              setEditMode(true);
            }}
          >
            Change Password
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.formWrapper}>
      <div className={s.fieldWrapper}>
        <label className={s.formLabel}>OLD PASSWORD</label>
        <Field
          type="password"
          className={classNames({
            [s.inputForm]: true,
            [s.hasError]: !!touched.oldPassword && !!errors.oldPassword,
          })}
          name="oldPassword"
          placeholder="Password"
          disabled={false}
        />
        <ErrorMessage errorMsg={errors.oldPassword} />
      </div>
      <div className={s.fieldWrapper}>
        <label className={s.formLabel}>NEW PASSWORD</label>
        <Field
          type="password"
          className={classNames({
            [s.inputForm]: true,
            [s.hasError]: !!touched.newPassword && !!errors.newPassword,
          })}
          name="newPassword"
          placeholder="Password"
          disabled={false}
        />
        <ErrorMessage errorMsg={errors.newPassword} />
      </div>
      <button
        type="submit"
        className={classNames({
          [s.submitButton]: true,
          [s.isLoading]: isLoading,
        })}
      >
        Change Password
      </button>
      <div
        className={s.toggleButton}
        onClick={() => {
          setEditMode(false);
        }}
      >
        Cancel
      </div>
    </div>
  );
};

interface AuthEditFormProps {
  dispatch: ThunkDispatch<{}, {}, AuthActions | AlertAction>;
}
const AuthEditForm: React.FC<AuthEditFormProps & ReturnType<typeof mapStateToProps>> = ({ currentUser, dispatch }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  const handleClickResendButton = React.useCallback(
    async () => {
      try {
        if (currentUser.email) {
          await AuthAPI.resendVerificationEmail(currentUser.email);
          dispatch({
            type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
            payload: {
              type: 'success',
              message: 'Successfully sent E-Mail. Please check your mail box.',
            },
          });
        }
      } catch (err) {
        dispatch({
          type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
          payload: {
            type: 'error',
            message: 'Sorry. we had an error during resending the verification email.',
          },
        });
      }
    },
    [currentUser]
  );

  if (!currentUser.isLoggedIn) return null;

  const isVerifiedUser = currentUser.oauthLoggedIn || currentUser.emailVerified;

  async function handleSubmit(values: AuthEditFormValues) {
    try {
      setIsLoading(true);
      await dispatch(changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword }));
      setIsLoading(false);
      setEditMode(false);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'success',
          message: 'Successfully changed password.',
        },
      });
    } catch (err) {
      setIsLoading(false);
      const error = PlutoAxios.getGlobalError(err);
      console.log(error);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: 'Sorry. we had an error during resending the verification email.',
        },
      });
    }
  }

  return (
    <div>
      <h1 className={s.title}>Account</h1>
      <Formik
        initialValues={{
          email: currentUser.email,
          oldPassword: '',
          newPassword: '',
        }}
        validate={validateForm}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        render={({ errors, touched }) => {
          return (
            <Form>
              <div className={s.formRow}>
                <div className={s.formWrapper}>
                  <label className={s.formLabel}>EMAIL</label>
                  <EmailField
                    email={currentUser.email}
                    editMode={editMode}
                    userVerified={isVerifiedUser}
                    hasError={!!touched.email && !!errors.email}
                    errorMsg={errors.email}
                    onClickResendButton={handleClickResendButton}
                  />
                </div>
                <PasswordField
                  isLoading={isLoading}
                  isSocialUser={currentUser.oauthLoggedIn}
                  errors={errors}
                  touched={touched}
                  editMode={editMode}
                  setEditMode={setEditMode}
                />
              </div>
            </Form>
          );
        }}
      />
      <div className={s.divider} />
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(withStyles<typeof AuthEditForm>(s)(AuthEditForm));
