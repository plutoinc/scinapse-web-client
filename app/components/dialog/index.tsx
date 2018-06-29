import * as React from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import Dialog from "@material-ui/core/Dialog";
import { AppState } from "../../reducers";
import * as Actions from "./actions";
import SignIn from "../auth/signIn";
import SignUp from "../auth/signUp";
import ResetPassword from "../auth/resetPasswordDialog";
import VerificationNeeded from "../auth/verificationNeeded";
import CollectionModal from "./components/collection";
import { resendVerificationEmail } from "../auth/emailVerification/actions";
import { DialogContainerProps } from "./types";
import { trackModalView } from "../../helpers/handleGA";
import { withStyles } from "../../helpers/withStylesHelper";
import { GLOBAL_DIALOG_TYPE } from "./reducer";
import { collectionSchema } from "../../model/collection";
import {
  PostCollectionParams,
  AddPaperToCollectionsParams
} from "../../api/collection";
const styles = require("./dialog.scss");

function mapStateToProps(state: AppState) {
  return {
    dialogState: state.dialog,
    currentUser: state.currentUser,
    myCollections: denormalize(
      state.dialog.myCollectionIds,
      [collectionSchema],
      state.entities
    )
  };
}

@withStyles<typeof DialogComponent>(styles)
class DialogComponent extends React.PureComponent<DialogContainerProps, {}> {
  public render() {
    const { dialogState } = this.props;

    return (
      <Dialog
        open={dialogState.isOpen}
        onClose={() => {
          this.closeDialog();
          trackModalView("outsideClickClose");
        }}
        classes={{
          paper: styles.dialogPaper
        }}
      >
        {this.getDialogContent(dialogState.type) || ""}
      </Dialog>
    );
  }

  private closeDialog = () => {
    const { dispatch } = this.props;
    dispatch(Actions.closeDialog());
  };

  private changeDialogType = (type: GLOBAL_DIALOG_TYPE) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeModalType(type));
  };

  private resendVerificationEmail = () => {
    const { dispatch, currentUser } = this.props;
    if (currentUser && currentUser.isLoggedIn) {
      dispatch(resendVerificationEmail(currentUser.email, true));
    }
  };

  private getMyCollections = () => {
    const { dispatch, currentUser } = this.props;

    if (currentUser && currentUser.isLoggedIn) {
      dispatch(Actions.getMyCollections(currentUser.id));
    }
  };

  private handleSubmitNewCollection = (params: PostCollectionParams) => {
    const { dispatch } = this.props;

    dispatch(Actions.postNewCollection(params));
  };

  private handleAddingPaperToCollections = async (
    params: AddPaperToCollectionsParams
  ) => {
    const { dispatch } = this.props;

    await dispatch(Actions.addPaperToCollections(params));
  };

  private getDialogContent = (type: GLOBAL_DIALOG_TYPE | null) => {
    const { currentUser, myCollections, dialogState } = this.props;

    switch (type) {
      case GLOBAL_DIALOG_TYPE.SIGN_IN:
        return <SignIn handleChangeDialogType={this.changeDialogType} />;
      case GLOBAL_DIALOG_TYPE.SIGN_UP:
        return <SignUp handleChangeDialogType={this.changeDialogType} />;
      case GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED:
        if (currentUser.isLoggedIn) {
          return (
            <VerificationNeeded
              email={currentUser.email}
              resendEmailFunc={this.resendVerificationEmail}
            />
          );
        }
        return null;
      case GLOBAL_DIALOG_TYPE.RESET_PASSWORD:
        return <ResetPassword handleCloseDialogRequest={this.closeDialog} />;
      case GLOBAL_DIALOG_TYPE.COLLECTION:
        if (
          currentUser.isLoggedIn &&
          currentUser.emailVerified &&
          dialogState.collectionDialogTargetPaperId
        ) {
          return (
            <CollectionModal
              currentUser={currentUser}
              myCollections={myCollections}
              handleCloseDialogRequest={this.closeDialog}
              getMyCollections={this.getMyCollections}
              handleSubmitNewCollection={this.handleSubmitNewCollection}
              handleAddingPaperToCollections={
                this.handleAddingPaperToCollections
              }
              collectionDialogPaperId={
                dialogState.collectionDialogTargetPaperId
              }
            />
          );
        } else if (currentUser.isLoggedIn && !currentUser.emailVerified) {
          return (
            <VerificationNeeded
              email={currentUser.email}
              resendEmailFunc={this.resendVerificationEmail}
            />
          );
        }
        return null;

      default:
        return null;
    }
  };
}
export default connect(mapStateToProps)(DialogComponent);
