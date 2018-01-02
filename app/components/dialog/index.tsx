import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IDialogStateRecord } from "./records";
import { IAppState } from "../../reducers";
import Dialog from "material-ui/Dialog";
import * as Actions from "./actions";

// Dialog Components
import SignIn from "../auth/signIn";
import SignUp from "../auth/signUp";
import VerificationNeeded from "../auth/verificationNeeded";
import { GLOBAL_DIALOG_TYPE } from "./records";
import { ICurrentUserRecord } from "../../model/currentUser";
import { resendVerificationEmail } from "../auth/emailVerification/actions";

const styles = require("./dialog.scss");

export interface IDialogContainerProps extends DispatchProp<IDialogContainerMappedState> {
  dialogState: IDialogStateRecord;
  currentUser: ICurrentUserRecord;
}

interface IDialogContainerMappedState {
  dialogState: IDialogStateRecord;
  currentUser: ICurrentUserRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    dialogState: state.dialog,
    currentUser: state.currentUser,
  };
}

class DialogComponent extends React.PureComponent<IDialogContainerProps, null> {
  private closeDialog = () => {
    const { dispatch } = this.props;
    dispatch(Actions.closeDialog());
  };

  private changeDialogType = (type: GLOBAL_DIALOG_TYPE) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeDialogType(type));
  };

  private resendVerificationEmail = () => {
    const { dispatch, currentUser } = this.props;

    dispatch(resendVerificationEmail(currentUser.email, true));
  };

  private getDialogContent = (type: GLOBAL_DIALOG_TYPE) => {
    const { currentUser } = this.props;
    switch (type) {
      case GLOBAL_DIALOG_TYPE.SIGN_IN:
        return <SignIn handleChangeDialogType={this.changeDialogType} />;
      case GLOBAL_DIALOG_TYPE.SIGN_UP:
        return <SignUp handleChangeDialogType={this.changeDialogType} />;
      case GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED:
        return VerificationNeeded({
          email: currentUser.email,
          resendEmailFunc: this.resendVerificationEmail,
        });
      default:
        break;
    }
  };

  render() {
    const { dialogState } = this.props;
    return (
      <div>
        <Dialog
          open={dialogState.isOpen}
          modal={false}
          autoDetectWindowHeight={false}
          onRequestClose={this.closeDialog}
          bodyStyle={{
            display: "flex",
            alignItems: "center",
            padding: "0",
            maxHeight: "600.5px",
            borderRadious: "15px",
          }}
          contentStyle={{ display: "flex" }}
          contentClassName={styles.contentClass}
        >
          {this.getDialogContent(dialogState.type)}
        </Dialog>
      </div>
    );
  }
}
export default connect(mapStateToProps)(DialogComponent);
