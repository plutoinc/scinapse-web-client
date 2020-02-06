import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Formik, Form, Field, FormikErrors } from 'formik';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from '@pluto_network/pluto-design-elements';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import AuthInputBox from '../../common/inputBox/authInputBox';
import { GLOBAL_DIALOG_TYPE, DialogState } from '../../dialog/reducer';
import DashedDividerWithContent from '../../common/separator';
import AuthTabs from '../authTabs';
import AuthAPI from '../../../api/auth';
import { SignInResult } from '../../../api/types/auth';
import { getCollections } from '../../collections/actions';
import { closeDialog } from '../../dialog/actions';
import { signInWithEmail, signInWithSocial } from './actions';
import validateEmail from '../../../helpers/validateEmail';
import AuthGuideContext from '../authGuideContext';
import { ActionCreators } from '../../../actions/actionTypes';
import { SIGN_UP_STEP } from '../signUp/types';
import { AppState } from '../../../reducers';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import AuthContextText from '../authContextText';
import useFBIsLoading from '../../../hooks/FBisLoadingHook';
import { MINIMUM_PASSWORD_LENGTH } from '../../../constants/auth';
import AuthButtons from '../authButton/authButtons';
import { fetchKeywordAlertList } from '../../../containers/keywordSettings/actions';
const s = require('./signIn.scss');

declare var FB: any;

interface EmailFormValues {
  email: string;
  password: string;
}

interface SignInProps {
  handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void;
  dialogState: DialogState;
  dispatch: Dispatch<any>;
  userActionType: Scinapse.ActionTicket.ActionTagType | undefined;
  query?: string;
}

const validateForm = (values: EmailFormValues) => {
  const errors: FormikErrors<EmailFormValues> = {};

  if (!validateEmail(values.email)) {
    errors.email = 'E-Mail is invalid';
  }

  if (!values.password || values.password.length < MINIMUM_PASSWORD_LENGTH) {
    errors.password = 'Minimum length is 8';
  }

  return errors;
};

const SignIn: React.FunctionComponent<SignInProps & RouteComponentProps<any>> = props => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState('');

  const isDialog = !!props.handleChangeDialogType;
  const FBIsLoading = useFBIsLoading();

  function handleClickFBLogin() {
    FB.login(
      async (res: any) => {
        if (res.authResponse) {
          const accessToken = res.authResponse.accessToken;
          const status = await AuthAPI.checkOAuthStatus('FACEBOOK', accessToken);

          if (status.isConnected) {
            await props.dispatch(signInWithSocial('FACEBOOK', accessToken));
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
            props.dispatch(closeDialog());
          } else {
            props.dispatch(
              ActionCreators.changeGlobalDialog({
                type: GLOBAL_DIALOG_TYPE.SIGN_UP,
                signUpStep: SIGN_UP_STEP.WITH_SOCIAL,
                oauthResult: {
                  email: status.email,
                  firstName: status.firstName,
                  lastName: status.lastName,
                  token: accessToken,
                  vendor: 'FACEBOOK',
                },
              })
            );
          }
        }
      },
      { scope: 'public_profile,email' }
    );
  }

  async function handleSubmit(formValues: EmailFormValues) {
    const { email, password } = formValues;

    try {
      setIsLoading(true);
      const res: SignInResult = await signInWithEmail({ email, password }, isDialog)(props.dispatch);
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
        await props.dispatch(fetchKeywordAlertList());
      }
      setIsLoading(false);

      if (isDialog) {
        props.dispatch(closeDialog());
      } else {
        props.history.push('/');
      }
    } catch (err) {
      setIsLoading(false);
      setNetworkError(err.message);
    }
  }

  return (
    <>
      <AuthContextText userActionType={props.userActionType} />
      <div className={s.authContainer}>
        <AuthGuideContext userActionType={props.userActionType} />
        <div className={s.authFormWrapper}>
          <AuthTabs onClickTab={props.handleChangeDialogType} activeTab="sign in" />
          <div className={s.formWrapper}>
            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={handleSubmit}
              validate={validateForm}
              validateOnChange={false}
              render={() => {
                return (
                  <Form>
                    <Field name="email" type="email" component={AuthInputBox} placeholder="E-mail" iconName="EMAIL" />
                    <Field
                      name="password"
                      type="password"
                      component={AuthInputBox}
                      placeholder="Password"
                      iconName="PASSWORD"
                    />
                    {networkError && <div className={s.errorContent}>{networkError}</div>}
                    <div
                      onClick={() => {
                        if (props.handleChangeDialogType) {
                          props.handleChangeDialogType(GLOBAL_DIALOG_TYPE.RESET_PASSWORD);
                        } else {
                          GlobalDialogManager.openResetPasswordDialog();
                        }
                      }}
                      className={s.forgotPasswordBox}
                    >
                      Forgot Password?
                    </div>
                    <Button
                      size="large"
                      type="submit"
                      elementType="button"
                      aria-label="Scinapse sign in button"
                      fullWidth
                      isLoading={isLoading}
                    >
                      <span>Sign in</span>
                    </Button>
                  </Form>
                );
              }}
            />
            <DashedDividerWithContent wrapperClassName={s.dashSeparatorBox} content="OR" />
            <AuthButtons
              handleClickFBLogin={handleClickFBLogin}
              handleClickGoogleLogin={values => {
                props.dispatch(
                  ActionCreators.changeGlobalDialog({
                    type: GLOBAL_DIALOG_TYPE.SIGN_UP,
                    signUpStep: SIGN_UP_STEP.WITH_SOCIAL,
                    oauthResult: values,
                  })
                );
              }}
              FBIsLoading={FBIsLoading}
              isLoading={isLoading}
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

export default withRouter(connect(mapStateToProps)(withStyles<typeof SignIn>(s)(SignIn)));
