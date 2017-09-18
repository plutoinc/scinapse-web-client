import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IDialogStateRecord } from "./records";
import { IAppState } from "../../reducers";
import Dialog from "material-ui/Dialog";
import * as Actions from "./actions";

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

  private changeDialogType = (type: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeDialogType(type));
  };

  private getDialogContent = (type: string) => {
    switch (type) {
      case "sign_in":
        return (
          <div>
            sign_in
            <button
              onClick={() => {
                this.changeDialogType("sign_up");
              }}
            >
              sign_Up
            </button>
          </div>
        );
      case "sign_up":
        return (
          <div>
            sign_up<button
              onClick={() => {
                this.changeDialogType("sign_in");
              }}
            >
              sign_in
            </button>
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
        <Dialog open={dialogState.isOpen} modal={false} onRequestClose={this.closeDialog}>
          {this.getDialogContent(dialogState.type)}
        </Dialog>
      </div>
    );
  }
}
export default connect(mapStateToProps)(DialogComponent);
