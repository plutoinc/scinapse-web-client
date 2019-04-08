import * as React from "react";
import { parse } from "qs";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as Actions from "./actions";
import { SignUpContainerProps, SIGN_UP_STEP } from "./types";
import { withStyles } from "../../../helpers/withStylesHelper";
import FirstForm from "./components/firstForm";
import SignUpForm, { SignUpFormValues } from "./components/signUpForm";
import FinalSignUpContent from "./components/finalSignUpContent";
import { OAuthInfo } from "../../../api/types/auth";
const styles = require("./signUp.scss");

const SignUp: React.FunctionComponent<SignUpContainerProps> = props => {
  const { location, history } = props;

  const [signUpStep, setSignUpStep] = React.useState(SIGN_UP_STEP.FIRST);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [OAuth, setOAuth] = React.useState<OAuthInfo>({ oauthId: "", uuid: "", vendor: null });

  React.useEffect(() => {
    const queryParams = parse(location.search, { ignoreQueryPrefix: true });
    const { code, vendor } = queryParams;
    const alreadySignUpCB = () => {
      history.push("/users/sign_in");
    };
    if (code && vendor) {
      setSignUpStep(SIGN_UP_STEP.WITH_SOCIAL);
      Actions.getAuthorizeCode(code, vendor, alreadySignUpCB).then(OAuthRes => {
        if (OAuthRes) {
          setOAuth({ oauthId: OAuthRes.oauthId, uuid: OAuthRes.uuid, vendor: OAuthRes.vendor });
          setEmail(OAuthRes.email || "");
        }
      });
    }
  }, []);

  async function handleSubmitSignUpWithEmail(values: SignUpFormValues) {
    await props.dispatch(Actions.signUpWithEmail(values));
  }

  async function handleSubmitSignUpWithSocial(values: SignUpFormValues) {
    const { firstName, lastName, affiliation } = values;

    if (OAuth.oauthId && OAuth.vendor) {
      try {
        await props.dispatch(
          Actions.signUpWithSocial(
            {
              email: values.email,
              firstName,
              lastName,
              affiliation,
              oauth: OAuth,
            },
            OAuth.vendor
          )
        );
      } catch (_err) {
        setSignUpStep(SIGN_UP_STEP.FIRST);
      }
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
          onClickTab={props.handleChangeDialogType}
        />
      );

    case SIGN_UP_STEP.FINAL_WITH_EMAIL:
      return (
        <FinalSignUpContent
          onSubmit={() => {
            history.push("/");
          }}
          contentType="email"
        />
      );

    case SIGN_UP_STEP.FINAL_WITH_SOCIAL:
      return (
        <FinalSignUpContent
          onSubmit={() => {
            history.push("/");
          }}
          contentType="social"
        />
      );

    default:
      return (
        <FirstForm
          onSubmit={values => {
            setEmail(values.email);
            setPassword(values.password);
            setSignUpStep(SIGN_UP_STEP.WITH_EMAIL);
          }}
          onClickTab={props.handleChangeDialogType}
        />
      );
  }
};

export default withRouter(connect()(withStyles<typeof SignUp>(styles)(SignUp)));
