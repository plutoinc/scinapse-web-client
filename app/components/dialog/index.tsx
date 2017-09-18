import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IDialogStateRecord } from "./records";
import { IAppState } from "../../reducers";
import Dialog from "material-ui/Dialog";
import * as Actions from "./actions";

// Dialog Components
import SignIn from "../auth/signIn";
import SignUp from "../auth/signUp";
import { GLOBAL_DIALOG_TYPE } from "./records";

const styles = require("./dialog.scss");

export interface IDialogContainerProps extends DispatchProp<IDialogContainerMappedState> {
  dialogState: IDialogStateRecord;
}

interface IDialogContainerMappedState {
  dialogState: IDialogStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    dialogState: state.dialog,
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

  private getDialogContent = (type: GLOBAL_DIALOG_TYPE) => {
    switch (type) {
      case GLOBAL_DIALOG_TYPE.SIGN_IN:
        return (
          <div>
            <SignIn handleChangeDialogType={this.changeDialogType} />
          </div>
        );
      case GLOBAL_DIALOG_TYPE.SIGN_UP:
        return (
          <div>
            <SignUp handleChangeDialogType={this.changeDialogType} />
          </div>
        );
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
            maxHeight: "582.5px",
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
