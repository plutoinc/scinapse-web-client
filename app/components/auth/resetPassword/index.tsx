import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { parse } from 'qs';
import { Field, Form, Formik, FormikErrors } from 'formik';
import AuthAPI from '../../../api/auth';
import AuthInputBox from '../../common/inputBox/authInputBox';
import { withStyles } from '../../../helpers/withStylesHelper';
import alertToast from '../../../helpers/makePlutoToastAction';
import PlutoAxios from '../../../api/pluto';
import { MINIMUM_PASSWORD_LENGTH } from '../../../constants/auth';
import Button from '../../common/button/button';
const styles = require('./resetPassword.scss');

interface FormValues {
  password: string;
  confirmPassword: string;
}

const validateForm = (values: FormValues) => {
  const errors: FormikErrors<FormValues> = {};

  if (!values.password || values.password.length < MINIMUM_PASSWORD_LENGTH) {
    errors.password = 'Minimum length is 8';
  }

  if (!values.confirmPassword || values.confirmPassword.length < MINIMUM_PASSWORD_LENGTH) {
    errors.confirmPassword = 'Minimum length is 8';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Password is different from confirm password';
  }

  return errors;
};

const ResetPasswordPage: React.FunctionComponent<RouteComponentProps<any>> = props => {
  React.useEffect(() => {
    const { location, history } = props;
    const queryParams = parse(location.search, { ignoreQueryPrefix: true });

    if (!queryParams.token) {
      alertToast({
        type: 'error',
        message: 'Invalid access. You need a proper reset password token from e-mail.',
      });
      history.push('/users/sign_in');
    }
  }, []);

  const [isLoading, setIsLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState('');
  async function handleSubmitForm(values: FormValues) {
    const queryParams = parse(props.location.search, { ignoreQueryPrefix: true });
    try {
      setIsLoading(true);
      await AuthAPI.resetPassword(values.password, queryParams.token);
      props.history.push('/users/sign_in');
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      setIsLoading(false);
      setNetworkError(error.message);
    }
  }

  return (
    <div className={styles.signInContainer}>
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        onSubmit={handleSubmitForm}
        validate={validateForm}
        validateOnChange={false}
      >
        <Form className={styles.formContainer}>
          <div className={styles.title}>RESET YOUR PASSWORD</div>
          <div className={styles.subtitle}>
            {`Almost done, just enter your new password below.
          Must be at least 8 characters!`}
          </div>
          <div className={styles.content}>
            <Field
              name="password"
              type="password"
              component={AuthInputBox}
              placeholder="New password"
              iconName="PASSWORD_ICON"
              wrapperStyles={{ width: '100%' }}
            />
            <Field
              name="confirmPassword"
              type="password"
              component={AuthInputBox}
              placeholder="Confirm password"
              iconName="PASSWORD_ICON"
              wrapperStyles={{ width: '100%' }}
            />
            {networkError && <div className={styles.errorContent}>{networkError}</div>}
            <Button
              type="submit"
              size="large"
              elementType="button"
              style={{ backgroundColor: '#6096ff', marginTop: '42px', fontSize: '14px' }}
              isLoading={isLoading}
              fullWidth
            >
              <span>RESET PASSWORD & SIGN IN</span>
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default withRouter(withStyles<typeof ResetPasswordPage>(styles)(ResetPasswordPage));
