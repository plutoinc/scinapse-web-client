import StoreManager from "../../store";
import { ActionCreators } from "../../actions/actionTypes";
import { GLOBAL_DIALOG_TYPE } from "../../components/dialog/reducer";
import { Collection } from "../../model/collection";
import { Paper } from "../../model/paper";
import ActionTicketManager from "../actionTicketManager";
import { getCurrentPageType } from "../../components/locationListener";

interface OpenSignUpDialogParams {
  userActionType?: Scinapse.ActionTicket.ActionTagType;
  actionArea?: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType;
}

class GlobalDialogManager {
  public openSignInDialog(userActionType?: Scinapse.ActionTicket.ActionTagType) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.SIGN_IN,
        userActionType,
      })
    );
  }

  public openSignUpDialog({ userActionType, actionArea }: OpenSignUpDialogParams) {
    if (userActionType) {
      ActionTicketManager.trackTicket({
        pageType: getCurrentPageType(),
        actionType: "fire",
        actionArea: actionArea || "",
        actionTag: "blockUnsignedUser",
        actionLabel: "",
      });
    }

    console.log("FIRED, ", actionArea);

    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: "fire",
      actionArea: actionArea || "",
      actionTag: "openSignUp",
      actionLabel: "",
    });

    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.SIGN_UP,
        userActionType,
      })
    );
  }

  public openVerificationDialog() {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED,
      })
    );
  }

  public openResetPasswordDialog() {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.RESET_PASSWORD,
      })
    );
  }

  public openCitationDialog(targetPaperId: number) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.CITATION,
        citationDialogTargetPaperId: targetPaperId,
      })
    );
  }

  public openCollectionDialog(targetPaperId: number) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.COLLECTION,
        collectionDialogTargetPaperId: targetPaperId,
      })
    );
  }

  public openNewCollectionDialog(targetPaperId?: number) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.NEW_COLLECTION,
        collectionDialogTargetPaperId: targetPaperId,
      })
    );
  }

  public openEditCollectionDialog(collection: Collection) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.EDIT_COLLECTION,
        collection,
      })
    );
  }

  public openAuthorListDialog(paper: Paper) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.AUTHOR_LIST_DIALOG,
        authorListTargetPaper: paper,
      })
    );
  }
}

const globalDialogManager = new GlobalDialogManager();

export default globalDialogManager;
