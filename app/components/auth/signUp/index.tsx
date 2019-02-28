import * as React from "react";
import { parse } from "qs";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as Actions from "./actions";
import { AppState } from "../../../reducers";
import { SIGN_UP_STEP } from "./reducer";
import { SignUpContainerProps } from "./types";
import { withStyles } from "../../../helpers/withStylesHelper";
import FirstForm from "./firstForm";
const styles = require("./signUp.scss");

function mapStateToProps(state: AppState) {
  return {
    signUpState: state.signUp,
  };
}

const AlternativeSignUp: React.FunctionComponent<SignUpContainerProps> = props => {
  const { dispatch, location, history } = props;

  const [signUpStep, setSignUpStep] = React.useState(SIGN_UP_STEP.FIRST);

  React.useEffect(() => {
    const queryParams = parse(location.search, { ignoreQueryPrefix: true });
    const searchCode = queryParams.code;
    const searchVendor = queryParams.vendor;
    const alreadySignUpCB = () => {
      history.push("/users/sign_in");
    };

    if (searchCode && searchVendor) {
      dispatch(Actions.getAuthorizeCode(searchCode, searchVendor, alreadySignUpCB));
    }
  });

  switch (signUpStep) {
    case SIGN_UP_STEP.WITH_EMAIL:
      return <div>HELLO EMAIL SIGN UP</div>;

    case SIGN_UP_STEP.WITH_SOCIAL:
      return null;

    case SIGN_UP_STEP.FINAL_WITH_EMAIL:
      return null;

    default:
      return (
        <FirstForm
          onSubmit={() => {
            setSignUpStep(SIGN_UP_STEP.WITH_EMAIL);
          }}
          onClickTab={props.handleChangeDialogType}
        />
      );
  }
};

export default withRouter(connect(mapStateToProps)(withStyles<typeof AlternativeSignUp>(styles)(AlternativeSignUp)));
