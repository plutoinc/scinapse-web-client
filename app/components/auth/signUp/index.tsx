import * as React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as Actions from "./actions";
import { SignUpContainerProps, SIGN_UP_STEP } from "./types";
import { withStyles } from "../../../helpers/withStylesHelper";
import FirstForm from "./components/firstForm";
import SignUpForm, { SignUpFormValues } from "./components/signUpForm";
import { OAUTH_VENDOR, SignUpWithSocialParams } from "../../../api/types/auth";
import { AppState } from "../../../reducers";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
const styles = require("./signUp.scss");

const SignUp: React.FunctionComponent<SignUpContainerProps> = props => {
  const { dialogState } = props;
  const [signUpStep, setSignUpStep] = React.useState(dialogState.signUpStep || SIGN_UP_STEP.FIRST);
  const [email, setEmail] = React.useState(dialogState.oauthResult ? dialogState.oauthResult.email || "" : "");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState(dialogState.oauthResult ? dialogState.oauthResult.firstName : "");
  const [lastName, setLastName] = React.useState(dialogState.oauthResult ? dialogState.oauthResult.lastName : "");
  const [token, setToken] = React.useState({
    token: dialogState.oauthResult ? dialogState.oauthResult.token : "",
    vendor: dialogState.oauthResult ? dialogState.oauthResult.vendor : "",
  });
  const authContext = dialogState.authContext;

  async function handleSubmitSignUpWithEmail(values: SignUpFormValues) {
    await props.dispatch(Actions.signUpWithEmail(values));

    if (authContext) {
      ActionTicketManager.trackTicket({
        pageType: authContext.pageType,
        actionType: "fire",
        actionArea: authContext.actionArea,
        actionTag: "signUp",
        actionLabel: authContext.expName ? authContext.expName : authContext.actionLabel,
        expName: authContext.expName,
      });
    }
  }

  async function handleSubmitSignUpWithSocial(values: SignUpFormValues) {
    const { firstName, lastName, affiliation } = values;

    const params: SignUpWithSocialParams = {
      email: values.email,
      firstName,
      lastName,
      affiliation,
      token: {
        vendor: token.vendor as OAUTH_VENDOR,
        token: token.token,
      },
    };

    try {
      await props.dispatch(Actions.signUpWithSocial(params));
      if (authContext) {
        ActionTicketManager.trackTicket({
          pageType: authContext.pageType,
          actionType: "fire",
          actionArea: authContext.actionArea,
          actionTag: "signUp",
          actionLabel: authContext.expName ? authContext.expName : authContext.actionLabel,
          expName: authContext.expName,
        });
      } else if (params.token.vendor === "ORCID") {
        ActionTicketManager.trackTicket({
          pageType: "home",
          actionType: "fire",
          actionArea: "unknown",
          actionTag: "signUp",
          actionLabel: "ORCID",
          expName: "",
        });
      }
    } catch (err) {
      console.error(err);
      setSignUpStep(SIGN_UP_STEP.FIRST);
      throw err;
    }
  }

  switch (signUpStep) {
    case SIGN_UP_STEP.WITH_EMAIL:
      return (
        <SignUpForm
          onSubmit={handleSubmitSignUpWithEmail}
          onSucceed={() => {
            setSignUpStep(SIGN_UP_STEP.FINAL_WITH_EMAIL);
          }}
          onClickBack={() => {
            setSignUpStep(SIGN_UP_STEP.FIRST);
          }}
          email={email}
          password={password}
          firstName=""
          lastName=""
          onClickTab={props.handleChangeDialogType}
        />
      );

    case SIGN_UP_STEP.WITH_SOCIAL:
      return (
        <SignUpForm
          onSubmit={handleSubmitSignUpWithSocial}
          onSucceed={() => {
            setSignUpStep(SIGN_UP_STEP.FINAL_WITH_SOCIAL);
          }}
          onClickBack={() => {
            setSignUpStep(SIGN_UP_STEP.FIRST);
          }}
          email={email}
          password={password}
          firstName={firstName}
          lastName={lastName}
          onClickTab={props.handleChangeDialogType}
        />
      );

    case SIGN_UP_STEP.FINAL_WITH_EMAIL:
      GlobalDialogManager.openFinalSignUpWithEmailDialog();
      return null;

    case SIGN_UP_STEP.FINAL_WITH_SOCIAL:
      GlobalDialogManager.openFinalSignUpWithSocialDialog();
      return null;

    default:
      return (
        <FirstForm
          onSubmit={values => {
            setEmail(values.email);
            setPassword(values.password);
            setSignUpStep(SIGN_UP_STEP.WITH_EMAIL);
          }}
          onSignUpWithSocial={(values: {
            email?: string | null;
            firstName: string;
            lastName: string;
            vendor: OAUTH_VENDOR;
            token: string;
          }) => {
            setEmail(values.email || "");
            setFirstName(values.firstName || "");
            setLastName(values.lastName || "");
            setToken({
              token: values.token,
              vendor: values.vendor,
            });
            setSignUpStep(SIGN_UP_STEP.WITH_SOCIAL);
          }}
          onClickTab={props.handleChangeDialogType}
          userActionType={props.userActionType}
        />
      );
  }
};

function mapStateToProps(state: AppState) {
  return {
    dialogState: state.dialog,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof SignUp>(styles)(SignUp)));
