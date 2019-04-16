import StoreManager from "../../store";
import { ActionCreators } from "../../actions/actionTypes";
import { GLOBAL_DIALOG_TYPE } from "../../components/dialog/reducer";
import { Collection } from "../../model/collection";
import { Paper } from "../../model/paper";
import { benefitExpTicketContext } from "../../constants/abTest";

interface openAuthDialogParams {
  benefitExpContext: benefitExpTicketContext;
  userActionType?: Scinapse.ActionTicket.ActionTagType;
}

class GlobalDialogManager {
  public openSignInDialog(params?: openAuthDialogParams) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.SIGN_IN,
        userActionType: params && params.userActionType,
        expContext: params && params.benefitExpContext,
      })
    );
  }

  public openSignUpDialog(params?: openAuthDialogParams) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.SIGN_UP,
        userActionType: params && params.userActionType,
        expContext: params && params.benefitExpContext,
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
