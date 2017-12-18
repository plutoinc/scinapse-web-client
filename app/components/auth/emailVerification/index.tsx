import * as React from "react";
import { connect, DispatchProp } from "react-redux";
// import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";
import { parse } from "query-string";
import { RouteProps } from "react-router";
import { IEmailVerificationStateRecord } from "./records";

const styles = require("./emailVerification.scss");

interface IEmailVerificationContainerProps extends DispatchProp<IEmailVerificationContainerMappedState> {
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  emailVerificationState: IEmailVerificationStateRecord;
  routing: RouteProps;
}

interface IEmailVerificationContainerMappedState {
  emailVerificationState: IEmailVerificationStateRecord;
  routing: RouteProps;
}

function mapStateToProps(state: IAppState) {
  return {
    emailVerificationState: state.emailVerification,
    routing: state.routing,
  };
}

interface IEmailVerificationParams {
  code?: string;
}

class EmailVerification extends React.PureComponent<IEmailVerificationContainerProps, {}> {
  public componentDidMount() {
    const { routing } = this.props;

    const locationSearch = routing.location.search;

    const searchParams: IEmailVerificationParams = parse(locationSearch);
    const searchCode = searchParams.code;
    console.log(searchCode);
  }

  public render() {
    return (
      <div className={styles.emailVerificationContainer}>
        <div className={styles.innerContainer}>Email Verification</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(EmailVerification);
