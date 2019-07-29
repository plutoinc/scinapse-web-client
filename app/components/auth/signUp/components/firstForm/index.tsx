import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Formik, Form, Field, FormikErrors } from 'formik';
import AuthAPI from '../../../../../api/auth';
import { withStyles } from '../../../../../helpers/withStylesHelper';
import AuthInputBox from '../../../../common/inputBox/authInputBox';
import { OAUTH_VENDOR } from '../../../../../api/types/auth';
import AuthButton from '../../../authButton';
import GoogleAuthButton from '../../../authButton/googleAuthButton';
import ORSeparator from '../../../separator';
import AuthTabs from '../../../authTabs';
import validateEmail from '../../../../../helpers/validateEmail';
import { GLOBAL_DIALOG_TYPE, DialogState } from '../../../../dialog/reducer';
import { debouncedCheckDuplicate } from '../../helpers/checkDuplicateEmail';
import AuthGuideContext from '../../../authGuideContext';
import AuthContextText from '../../../authContextText';
import { closeDialog } from '../../../../dialog/actions';
import { handleClickORCIDBtn } from '../../actions';
import { signInWithSocial } from '../../../signIn/actions';
import { AppState } from '../../../../../reducers';
import ActionTicketManager from '../../../../../helpers/actionTicketManager';
import useFBIsLoading from '../../../../../hooks/FBisLoadingHook';
import { MINIMUM_PASSWORD_LENGTH } from '../../../../../constants/auth';
const s = require('./firstForm.scss');

declare var FB: any;

interface FirstFormProps {
  onSubmit: (values: FormValues) => void;
  onClickTab: (type: GLOBAL_DIALOG_TYPE) => void;
  userActionType: Scinapse.ActionTicket.ActionTagType | undefined;
  onSignUpWithSocial: (
    values: { email?: string | null; firstName: string; lastName: string; token: string; vendor: OAUTH_VENDOR }
  ) => void;
  dialogState: DialogState;
  dispatch: Dispatch<any>;
}

interface FormValues {
  email: string;
  password: string;
}

export const oAuthBtnBaseStyle: React.CSSProperties = { position: 'relative', fontSize: '13px', marginTop: '10px' };

const FirstForm: React.FunctionComponent<FirstFormProps> = props => {
  const { dispatch, dialogState } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const FBIsLoading = useFBIsLoading();

  function handleClickFBLogin() {
    FB.login(async (res: any) => {
      if (res.authResponse) {
        const accessToken = res.authResponse.accessToken;
        const status = await AuthAPI.checkOAuthStatus('FACEBOOK', accessToken);

        if (status.isConnected) {
          await dispatch(signInWithSocial('FACEBOOK', accessToken));
          const authContext = dialogState.authContext;
          if (authContext) {
            ActionTicketManager.trackTicket({
              pageType: authContext.pageType,
              actionType: 'fire',
              actionArea: authContext.actionArea,
              actionTag: 'signIn',
              actionLabel: authContext.actionLabel,
              expName: authContext.expName,
            });
          }
          dispatch(closeDialog());
        } else {
          props.onSignUpWithSocial({
            email: status.email,
            firstName: status.firstName,
            lastName: status.lastName,
            token: accessToken,
            vendor: 'FACEBOOK',
          });
        }
      }
    });
  }

  const validateForm = async (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    const { email, password } = values;

    if (!validateEmail(values.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setIsLoading(true);
    const errorMsg = await debouncedCheckDuplicate(email);
    setIsLoading(false);

    if (errorMsg) {
      errors.email = errorMsg;
    }

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      errors.password = 'Must have at least 8 characters!';
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  };

  return (
    <>
      <AuthContextText userActionType={props.userActionType} />
      <div className={s.authContainer}>
        <AuthGuideContext userActionType={props.userActionType} />
        <div className={s.authFormWrapper}>
          <AuthTabs onClickTab={props.onClickTab} activeTab={'sign up'} />
          <div className={s.formWrapper}>
            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={props.onSubmit}
              validate={validateForm}
              render={() => {
                return (
                  <Form>
                    <Field
                      name="email"
                      type="email"
                      component={AuthInputBox}
                      placeholder="E-mail"
                      iconName="EMAIL_ICON"
                    />
                    <Field
                      name="password"
                      type="password"
                      component={AuthInputBox}
                      placeholder="Password"
                      iconName="PASSWORD_ICON"
                    />
                    <AuthButton
                      type="submit"
                      isLoading={isLoading}
                      text="SIGN UP"
                      style={{ backgroundColor: '#6096ff', marginTop: '10px', fontSize: '14px' }}
                    />
                  </Form>
                );
              }}
            />
            <ORSeparator />
            <AuthButton
              isLoading={isLoading}
              text="CONTINUE WITH FACEBOOK"
              style={{ ...oAuthBtnBaseStyle, backgroundColor: '#3859ab', marginTop: '18px' }}
              iconName="FACEBOOK_LOGO"
              iconClassName={s.fbIconWrapper}
              onClick={handleClickFBLogin}
              disabled={FBIsLoading}
            />
            <GoogleAuthButton
              isLoading={isLoading}
              text="CONTINUE WITH GOOGLE"
              style={{ ...oAuthBtnBaseStyle, backgroundColor: '#dc5240' }}
              iconName="GOOGLE_LOGO"
              iconClassName={s.googleIconWrapper}
              onSignUpWithSocial={props.onSignUpWithSocial}
            />
            <AuthButton
              isLoading={isLoading}
              text="CONTINUE WITH ORCID"
              style={{ ...oAuthBtnBaseStyle, backgroundColor: '#a5d027' }}
              iconName="ORCID_LOGO"
              iconClassName={s.orcidIconWrapper}
              onClick={handleClickORCIDBtn}
            />
          </div>
        </div>
      </div>
    </>
  );
};

function mapStateToProps(state: AppState) {
  return {
    dialogState: state.dialog,
  };
}
export default connect(mapStateToProps)(withStyles<typeof FirstForm>(s)(FirstForm));
