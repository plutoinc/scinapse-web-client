import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Formik, Form, Field, FormikErrors } from 'formik';
import AuthAPI from '../../../../../api/auth';
import { withStyles } from '../../../../../helpers/withStylesHelper';
import AuthInputBox from '../../../../common/inputBox/authInputBox';
import { OAUTH_VENDOR, SignInResult } from '../../../../../api/types/auth';
import Button from '../../../../common/button/button';
import GoogleAuthButton from '../../../authButton/googleAuthButton';
import ORSeparator from '../../../separator';
import AuthTabs from '../../../authTabs';
import validateEmail from '../../../../../helpers/validateEmail';
import { GLOBAL_DIALOG_TYPE, DialogState } from '../../../../dialog/reducer';
import AuthGuideContext from '../../../authGuideContext';
import AuthContextText from '../../../authContextText';
import { closeDialog } from '../../../../dialog/actions';
import { handleClickORCIDBtn, checkDuplicatedEmail } from '../../actions';
import { signInWithSocial, signInWithEmail } from '../../../signIn/actions';
import { AppState } from '../../../../../reducers';
import ActionTicketManager from '../../../../../helpers/actionTicketManager';
import useFBIsLoading from '../../../../../hooks/FBisLoadingHook';
import { MINIMUM_PASSWORD_LENGTH } from '../../../../../constants/auth';
import { getCollections } from '../../../../collections/actions';
import Icon from '../../../../../icons';
import { getUserGroupName } from '../../../../../helpers/abTestHelper';
import { AUTH_METHOD_EXPERIMENT } from '../../../../../constants/abTestGlobalValue';
import { AuthMethodTestType } from '../../../../../constants/abTestObject';
const s = require('./firstForm.scss');

declare var FB: any;

interface FirstFormProps {
  initialEmail: string;
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
const enum authButtonType {
  FACEBOOK,
  GOOGLE,
  ORCID,
}

export const oAuthBtnBaseStyle: React.CSSProperties = { position: 'relative', fontSize: '13px', marginTop: '10px' };

function getAuthOrderType(currentAuthMethodType: string) {
  switch (currentAuthMethodType) {
    case AuthMethodTestType.ORCID_TOP:
      return [authButtonType.ORCID, authButtonType.GOOGLE, authButtonType.FACEBOOK];
    case AuthMethodTestType.NO_FACEBOOK:
      return [authButtonType.ORCID, authButtonType.GOOGLE];
    case AuthMethodTestType.NO_GOOGLE:
      return [authButtonType.ORCID, authButtonType.FACEBOOK];
    case AuthMethodTestType.ONLY_ORCID:
      return [authButtonType.ORCID];
    default:
      return [authButtonType.FACEBOOK, authButtonType.GOOGLE, authButtonType.ORCID];
  }
}

const FirstForm: React.FunctionComponent<FirstFormProps> = props => {
  const { dispatch, dialogState, initialEmail } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState('');
  const [authBtnOrderType, setAuthBtnOrderType] = React.useState<authButtonType[]>([]);
  const FBIsLoading = useFBIsLoading();

  React.useEffect(() => {
    const authMethodType = getUserGroupName(AUTH_METHOD_EXPERIMENT) || '';
    setAuthBtnOrderType(getAuthOrderType(authMethodType));
  }, []);

  async function onSubmit(values: FormValues) {
    const { email, password } = values;
    const duplicatedEmail = await checkDuplicatedEmail(email);

    if (!duplicatedEmail) return props.onSubmit(values);

    try {
      setIsLoading(true);
      const res: SignInResult = await signInWithEmail({ email, password }, true)(props.dispatch);
      const authContext = props.dialogState.authContext;
      if (authContext) {
        let actionLabel: string | null = authContext.expName || authContext.actionLabel;

        if (!actionLabel) {
          actionLabel = 'topBar';
        }

        ActionTicketManager.trackTicket({
          pageType: authContext.pageType,
          actionType: 'fire',
          actionArea: authContext.actionArea,
          actionTag: 'signIn',
          actionLabel,
          expName: authContext.expName,
        });
      }
      if (res.member) {
        await props.dispatch(getCollections(res.member.id));
      }
      setIsLoading(false);

      props.dispatch(closeDialog());
    } catch (err) {
      setIsLoading(false);
      setNetworkError('Your already sign up. Please checked password.');
    }
  }

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

    if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      errors.password = 'Must have at least 8 characters!';
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  };

  const buttons = authBtnOrderType.map(type => {
    if (type === authButtonType.FACEBOOK) {
      return (
        <div className={s.authButtonWrapper} key={type}>
          <Button
            size="large"
            elementType="button"
            style={{ backgroundColor: '#3859ab' }}
            onClick={handleClickFBLogin}
            disabled={FBIsLoading}
            isLoading={isLoading}
            fullWidth
          >
            <Icon icon="FACEBOOK_LOGO" />
            <span>Continue with Facebook</span>
          </Button>
        </div>
      );
    } else if (type === authButtonType.GOOGLE) {
      return (
        <div className={s.authButtonWrapper} key={type}>
          <GoogleAuthButton isLoading={isLoading} onSignUpWithSocial={props.onSignUpWithSocial} />
        </div>
      );
    } else {
      return (
        <div className={s.authButtonWrapper} key={type}>
          <Button
            size="large"
            elementType="button"
            style={{ backgroundColor: '#a5d027' }}
            disabled={FBIsLoading}
            isLoading={isLoading}
            onClick={handleClickORCIDBtn}
            fullWidth
          >
            <Icon icon="ORCID_LOGO" />
            <span>Continue with ORCID</span>
          </Button>
        </div>
      );
    }
  });

  return (
    <>
      <AuthContextText userActionType={props.userActionType} />
      <div className={s.authContainer}>
        <AuthGuideContext userActionType={props.userActionType} />
        <div className={s.authFormWrapper}>
          <AuthTabs onClickTab={props.onClickTab} activeTab={'sign up'} />
          <div className={s.formWrapper}>
            <Formik
              initialValues={{ email: initialEmail, password: '' }}
              onSubmit={onSubmit}
              validate={validateForm}
              render={() => {
                return (
                  <Form>
                    <Field
                      name="email"
                      type="email"
                      component={AuthInputBox}
                      autoFocus={!props.initialEmail}
                      placeholder="E-mail"
                      iconName="EMAIL_ICON"
                    />
                    <Field
                      name="password"
                      type="password"
                      component={AuthInputBox}
                      placeholder="Password"
                      iconName="PASSWORD_ICON"
                      autoFocus={!!props.initialEmail}
                    />
                    {networkError && <div className={s.errorContent}>{networkError}</div>}
                    <div className={s.authButtonWrapper}>
                      <Button type="submit" elementType="button" isLoading={isLoading} fullWidth size="large">
                        <span>Sign up</span>
                      </Button>
                    </div>
                  </Form>
                );
              }}
            />
            <ORSeparator />
            {buttons}
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
