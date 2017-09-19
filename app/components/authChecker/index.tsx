import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { IAuthCheckerStateRecord } from "./records";
import { checkLoggedIn } from "../auth/actions";

interface IAuthCheckerProps extends DispatchProp<any> {
  authChecker: IAuthCheckerStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    authChecker: state.authChecker,
  };
}

class AuthChecker extends React.PureComponent<IAuthCheckerProps, {}> {
  public componentWillMount() {
    const { dispatch } = this.props;
    dispatch(checkLoggedIn());
  }

  public render() {
    const { authChecker } = this.props;

    if (authChecker.isLoading) {
      return (
        <div
          style={{
            position: "fixed",
            zIndex: 989898,
            backgroundColor: "#ddd",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        >
          Loading...
        </div>
      );
    } else {
      return null;
    }
  }
}

export default connect(mapStateToProps)(AuthChecker);
