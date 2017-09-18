import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IDialogStateRecord } from "./records";
import { IAppState } from "../../reducers";
import Dialog from "material-ui/Dialog";
import * as Actions from "./actions";

export interface IDialogContainerProps {
  dispatch: Dispatch<any>;
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

  render() {
    const { dialogState } = this.props;
    return (
      <div>
        <Dialog open={dialogState.isOpen} modal={false} onRequestClose={this.closeDialog}>
          dialog test
        </Dialog>
      </div>
    );
  }
}
export default connect(mapStateToProps)(DialogComponent);
