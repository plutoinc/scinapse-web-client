import StoreManager from "../../store";
import { ActionCreators } from "../../actions/actionTypes";
import { GLOBAL_DIALOG_TYPE } from "../../components/dialog/reducer";

class GlobalDialogManager {
  public openSignUpDialog() {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.SIGN_UP,
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
}

const globalDialogManager = new GlobalDialogManager();

export default globalDialogManager;
