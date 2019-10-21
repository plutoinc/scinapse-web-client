import React, { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik, FormikErrors, FormikTouched } from 'formik';
import { AppState } from '../../reducers';
import { MINIMUM_PASSWORD_LENGTH } from '../../constants/auth';
import { changePassword, resendVerificationEmail } from '../../actions/auth';
import { CurrentUser } from '../../model/currentUser';
import Button from '../../components/common/button';
const useStyles = require('isomorphic-style-loader/useStyles');
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
          <Button
            elementType="button"
            variant="outlined"
            color="gray"
            onClick={onClickResendButton}
            style={{ marginLeft: '8px' }}
          >
            <span>Resend Mail</span>
          </Button>
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
          <Button
            elementType="button"
            variant="outlined"
            color="gray"
            onClick={() => setEditMode(true)}
            style={{ marginLeft: '8px' }}
          >
            <span>Change Password</span>
          </Button>
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
      <div className={s.buttonsWrapper}>
        <Button elementType="button" isLoading={isLoading} type="submit">
          <span>Change Password</span>
        </Button>
        <Button
          elementType="button"
          variant="outlined"
          color="gray"
          onClick={() => setEditMode(false)}
          style={{ marginLeft: '8px' }}
        >
          <span>Cancel</span>
        </Button>
      </div>
    </div>
  );
};

const AuthEditForm: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  if (!currentUser.isLoggedIn) return null;

  const isVerifiedUser = currentUser.oauthLoggedIn || currentUser.emailVerified;

  async function handleSubmit(values: AuthEditFormValues) {
    try {
      setIsLoading(true);
      await dispatch(changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword }));
      setIsLoading(false);
      setEditMode(false);
    } catch (err) {
      setIsLoading(false);
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
                    onClickResendButton={() => dispatch(resendVerificationEmail(currentUser.email))}
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

export default AuthEditForm;
