import * as React from "react";
import { parse } from "qs";
import { connect, Dispatch } from "react-redux";
import { Formik, Form, Field, FormikErrors } from "formik";
import { withRouter, RouteComponentProps } from "react-router-dom";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { withStyles } from "../../../helpers/withStylesHelper";
import AuthInputBox from "../../common/inputBox/authInputBox";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/reducer";
import AuthButton from "../authButton";
import GoogleAuthButton from "../authButton/googleAuthButton";
import ORSeparator from "../separator";
import AuthTabs from "../authTabs";
import AuthAPI from "../../../api/auth";
import { SignInResult, OAUTH_VENDOR } from "../../../api/types/auth";
import { getCollections } from "../../collections/actions";
import { closeDialog } from "../../dialog/actions";
import { signInWithEmail, signInWithSocial, getAuthorizeCode } from "./actions";
import validateEmail from "../../../helpers/validateEmail";
import FailedToSignIn from "./components/failedToSignIn";
import AuthGuideContext from "../authGuideContext";
import { ACTION_TYPES, ActionCreators } from "../../../actions/actionTypes";
import { SIGN_UP_STEP } from "../signUp/types";
const s = require("./signIn.scss");
const store = require("store");

declare var FB: any;

interface EmailFormValues {
  email: string;
  password: string;
}

interface SignInProps {
  handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void;
  dispatch: Dispatch<any>;
  userActionType: Scinapse.ActionTicket.ActionTagType | undefined;
}

const oAuthBtnBaseStyle: React.CSSProperties = { position: "relative", fontSize: "13px", marginTop: "10px" };

function handleClickOAuthBtn(vendor: OAUTH_VENDOR) {
  return () => {
    store.set("oauthRedirectPath", `${location.pathname}${location.search}`);
    signInWithSocial(vendor);
  };
}

const validateForm = (values: EmailFormValues) => {
  const errors: FormikErrors<EmailFormValues> = {};

  if (!validateEmail(values.email)) {
    errors.email = "E-Mail is invalid";
  }

  if (!values.password || values.password.length < 8) {
    errors.password = "Minimum length is 8";
  }

  return errors;
};

const SignIn: React.FunctionComponent<SignInProps & RouteComponentProps<any>> = props => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState("");
  const isDialog = !!props.handleChangeDialogType;
  const [notRegisteredWithSocial, setNotRegisteredWithSocial] = React.useState(false);

  function handleClickFBLogin() {
    FB.login(async (res: any) => {
      if (res.authResponse) {
        const accessToken = res.authResponse.accessToken;
        const status = await AuthAPI.checkOAuthStatus("FACEBOOK", accessToken);

        if (status.isConnected) {
          const user = await AuthAPI.loginWithOAuth("FACEBOOK", accessToken);
          props.dispatch({
            type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
            payload: {
              user: user.member,
              loggedIn: user.loggedIn,
              oauthLoggedIn: user.oauthLoggedIn,
            },
          });
          props.dispatch(closeDialog());
        } else {
          props.dispatch(
            ActionCreators.changeGlobalDialog({
              type: GLOBAL_DIALOG_TYPE.SIGN_UP,
              signUpStep: SIGN_UP_STEP.WITH_SOCIAL,
              oauthResult: status,
            })
          );
        }
      }
    });
  }

  React.useEffect(() => {
    const queryParams = parse(props.location.search, { ignoreQueryPrefix: true });
    const { code, vendor } = queryParams;

    if (code && vendor) {
      props.dispatch(getAuthorizeCode(code, vendor)).catch(err => {
        if (err.response && err.response.status && err.response.status === 401) {
          setNotRegisteredWithSocial(true);
        }
      });
    }
  }, []);

  async function handleSubmit(formValues: EmailFormValues) {
    const { email, password } = formValues;

    try {
      setIsLoading(true);
      setNetworkError("");
      const res: SignInResult = await props.dispatch(signInWithEmail({ email, password }, isDialog));
      if (res.member) {
        await props.dispatch(getCollections(res.member.id));
      }
      setIsLoading(false);

      if (isDialog) {
        props.dispatch(closeDialog());
      } else {
        props.history.push("/");
      }
    } catch (err) {
      setIsLoading(false);
      setNetworkError(err.message);
    }
  }

  if (notRegisteredWithSocial) {
    return (
      <>
        <FailedToSignIn
          onClickTab={props.handleChangeDialogType}
          onClickGoBack={() => {
            setNotRegisteredWithSocial(false);
          }}
        />
      </>
    );
  }

  return (
    <div className={s.authContainer}>
      <AuthGuideContext userActionType={props.userActionType} />
      <div className={s.authFormWrapper}>
        <AuthTabs onClickTab={props.handleChangeDialogType} activeTab="sign in" />
        <div className={s.formWrapper}>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            validate={validateForm}
            validateOnChange={false}
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
                  <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    text="SIGN IN"
                    style={{ backgroundColor: "#6096ff", marginTop: "10px", fontSize: "14px" }}
                  />
                </Form>
              );
            }}
          />
          <ORSeparator />
          <AuthButton
            isLoading={isLoading}
            text="CONTINUE WITH FACEBOOK"
            style={{ ...oAuthBtnBaseStyle, backgroundColor: "#3859ab", marginTop: "18px" }}
            iconName="FACEBOOK_LOGO"
            iconClassName={s.fbIconWrapper}
            onClick={handleClickFBLogin}
          />
          <GoogleAuthButton
            isLoading={isLoading}
            text="CONTINUE WITH GOOGLE"
            style={{ ...oAuthBtnBaseStyle, backgroundColor: "#dc5240" }}
            iconName="GOOGLE_LOGO"
            iconClassName={s.googleIconWrapper}
            onSignInWithSocial={(user: SignInResult) => {
              props.dispatch({
                type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
                payload: {
                  user: user.member,
                  loggedIn: user.loggedIn,
                  oauthLoggedIn: user.oauthLoggedIn,
                },
              });
              props.dispatch(closeDialog());
            }}
            onSignUpWithSocial={values => {
              props.dispatch(
                ActionCreators.changeGlobalDialog({
                  type: GLOBAL_DIALOG_TYPE.SIGN_UP,
                  signUpStep: SIGN_UP_STEP.WITH_SOCIAL,
                  oauthResult: values,
                })
              );
            }}
          />
          <AuthButton
            isLoading={isLoading}
            text="CONTINUE WITH ORCID"
            style={{ ...oAuthBtnBaseStyle, backgroundColor: "#a5d027" }}
            iconName="ORCID_LOGO"
            iconClassName={s.orcidIconWrapper}
            onClick={handleClickOAuthBtn("ORCID")}
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(connect()(withStyles<typeof SignIn>(s)(SignIn)));
