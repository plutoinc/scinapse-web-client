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
import CollectionDialog from "./components/collection";
import NewCollectionDialog from "./components/newCollection";
import EditCollectionDialog from "./components/editCollection";
import { resendVerificationEmail } from "../auth/emailVerification/actions";
import { DialogContainerProps } from "./types";
import { trackDialogView } from "../../helpers/handleGA";
import { withStyles } from "../../helpers/withStylesHelper";
import { GLOBAL_DIALOG_TYPE } from "./reducer";
import { collectionSchema } from "../../model/collection";
import {
  PostCollectionParams,
  AddPaperToCollectionParams,
  RemovePapersFromCollectionParams,
  UpdateCollectionParams,
} from "../../api/collection";
import CitationBox from "../paperShow/components/citationBox";
import { AvailableCitationType } from "../paperShow/records";
import { push } from "connected-react-router";
import AuthorListDialog from "../authorListDialog";
const styles = require("./dialog.scss");

function mapStateToProps(state: AppState) {
  return {
    dialogState: state.dialog,
    currentUser: state.currentUser,
    myCollections: denormalize(state.dialog.myCollectionIds, [collectionSchema], state.entities),
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
          trackDialogView("outsideClickClose");
        }}
        classes={{
          paper: styles.dialogPaper,
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
    dispatch(Actions.changeDialogType(type));
  };

  private resendVerificationEmail = () => {
    const { dispatch, currentUser } = this.props;
    if (currentUser && currentUser.isLoggedIn) {
      dispatch(resendVerificationEmail(currentUser.email, true));
    }
  };

  private getMyCollections = () => {
    const { dispatch, currentUser, dialogState } = this.props;

    if (currentUser && currentUser.isLoggedIn && (currentUser.oauthLoggedIn || currentUser.emailVerified)) {
      dispatch(Actions.getMyCollections(dialogState.collectionDialogTargetPaperId));
    }
  };

  private handleSubmitNewCollection = async (params: PostCollectionParams) => {
    const { dispatch } = this.props;

    await dispatch(Actions.postNewCollection(params));
  };

  private handleAddingPaperToCollection = async (params: AddPaperToCollectionParams) => {
    const { dispatch } = this.props;

    await dispatch(Actions.addPaperToCollection(params));
  };

  private handleRemovingPaperFromCollection = async (params: RemovePapersFromCollectionParams) => {
    const { dispatch } = this.props;

    await dispatch(Actions.removePaperFromCollection(params));
  };

  private handleDeleteCollection = async (collectionId: number) => {
    const { dispatch, currentUser } = this.props;

    await dispatch(Actions.deleteCollection(collectionId));
    dispatch(push(`/users/${currentUser.id}/collections`));
  };

  private handleUpdateCollection = async (params: UpdateCollectionParams) => {
    const { dispatch } = this.props;

    await dispatch(Actions.updateCollection(params));
  };

  private fetchCitationText = () => {
    const { dispatch, dialogState } = this.props;

    if (dialogState.citationPaperId) {
      dispatch(
        Actions.getCitationText({
          type: dialogState.activeCitationTab,
          paperId: dialogState.citationPaperId,
        })
      );
    }
  };

  private handleClickCitationTab = (tab: AvailableCitationType) => {
    const { dialogState, dispatch } = this.props;

    if (dialogState.citationPaperId) {
      dispatch(
        Actions.getCitationText({
          type: tab,
          paperId: dialogState.citationPaperId,
        })
      );
      dispatch(Actions.changeCitationTab(tab));
    }
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
          return <VerificationNeeded email={currentUser.email} resendEmailFunc={this.resendVerificationEmail} />;
        }
        return null;
      case GLOBAL_DIALOG_TYPE.RESET_PASSWORD:
        return <ResetPassword handleCloseDialogRequest={this.closeDialog} />;

      case GLOBAL_DIALOG_TYPE.CITATION: {
        if (dialogState.citationPaperId) {
          return (
            <CitationBox
              paperId={dialogState.citationPaperId}
              activeTab={dialogState.activeCitationTab}
              isLoading={dialogState.isLoadingCitationText}
              citationText={dialogState.citationText}
              closeCitationDialog={this.closeDialog}
              handleClickCitationTab={this.handleClickCitationTab}
              fetchCitationText={this.fetchCitationText}
            />
          );
        }
        return null;
      }
      case GLOBAL_DIALOG_TYPE.COLLECTION:
        if (
          currentUser.isLoggedIn &&
          (currentUser.oauthLoggedIn || currentUser.emailVerified) &&
          dialogState.collectionDialogTargetPaperId
        ) {
          return (
            <CollectionDialog
              currentUser={currentUser}
              myCollections={myCollections}
              handleCloseDialogRequest={this.closeDialog}
              getMyCollections={this.getMyCollections}
              handleSubmitNewCollection={this.handleSubmitNewCollection}
              handleRemovingPaperFromCollection={this.handleRemovingPaperFromCollection}
              handleAddingPaperToCollections={this.handleAddingPaperToCollection}
              collectionDialogPaperId={dialogState.collectionDialogTargetPaperId}
            />
          );
        } else if (currentUser.isLoggedIn && !currentUser.emailVerified && !currentUser.oauthLoggedIn) {
          this.changeDialogType(GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED);
          break;
        } else if (!currentUser.isLoggedIn) {
          this.changeDialogType(GLOBAL_DIALOG_TYPE.SIGN_UP);
          break;
        }
        return null;

      case GLOBAL_DIALOG_TYPE.NEW_COLLECTION:
        return (
          <NewCollectionDialog
            handleCloseDialogRequest={this.closeDialog}
            currentUser={currentUser}
            handleMakeCollection={this.handleSubmitNewCollection}
          />
        );
      case GLOBAL_DIALOG_TYPE.EDIT_COLLECTION:
        if (dialogState.collection) {
          return (
            <EditCollectionDialog
              handleCloseDialogRequest={this.closeDialog}
              currentUser={currentUser}
              handleDeleteCollection={this.handleDeleteCollection}
              handleUpdateCollection={this.handleUpdateCollection}
              collection={dialogState.collection}
            />
          );
        }
        return null;

      case GLOBAL_DIALOG_TYPE.AUTHOR_LIST_DIALOG:
        return <AuthorListDialog handleCloseDialogRequest={this.closeDialog} />;

      default:
        return null;
    }
  };
}
export default connect(mapStateToProps)(DialogComponent);
