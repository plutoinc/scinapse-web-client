import * as React from "react";
import { connect, DispatchProp } from "react-redux";
// import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";
import { parse } from "query-string";
import { RouteProps } from "react-router";

const styles = require("./emailConfirm.scss");

interface IEmailConfirmContainerProps extends DispatchProp<IEmailConfirmContainerMappedState> {
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  routing: RouteProps;
}

interface IEmailConfirmContainerMappedState {
  routing: RouteProps;
}

function mapStateToProps(state: IAppState) {
  return {
    routing: state.routing,
  };
}

interface IEmailConfirmParams {
  code?: string;
}

class EmailConfirm extends React.PureComponent<IEmailConfirmContainerProps, {}> {
  public componentDidMount() {
    const { routing } = this.props;

    const locationSearch = routing.location.search;

    const searchParams: IEmailConfirmParams = parse(locationSearch);
    const searchCode = searchParams.code;
    console.log(searchCode);
  }

  public render() {
    return (
      <div className={styles.emailConfirmContainer}>
        <div className={styles.innerContainer}>email confirm</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(EmailConfirm);
