import StoreManager from '../../store/store';
import { ActionCreators } from '../../actions/actionTypes';
import { GLOBAL_DIALOG_TYPE } from '../../components/dialog/reducer';
import { Collection } from '../../model/collection';
import { Paper, PaperFigure } from '../../model/paper';
import { SignUpConversionExpTicketContext as AuthContext } from '../../constants/abTest';
import { PaperProfile } from '../../model/profile';

interface OpenAuthDialogParams {
  authContext: AuthContext;
  userActionType?: Scinapse.ActionTicket.ActionTagType;
  isBlocked?: boolean;
}

class GlobalDialogManager {
  public openSignInDialog(params?: OpenAuthDialogParams) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.SIGN_IN,
        userActionType: params && params.userActionType,
        authContext: params && params.authContext,
      })
    );
  }

  public openSignUpDialog(params?: OpenAuthDialogParams) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.SIGN_UP,
        userActionType: params && params.userActionType,
        authContext: params && params.authContext,
        isBlocked: params && params.isBlocked,
      })
    );
  }

  public openFinalSignUpWithEmailDialog() {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.FINAL_SIGN_UP_WITH_EMAIL,
        isBlocked: true,
      })
    );
  }

  public openFinalSignUpWithSocialDialog() {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.FINAL_SIGN_UP_WITH_SOCIAL,
        isBlocked: true,
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

  public openCitationDialog(targetPaperId: string) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.CITATION,
        citationDialogTargetPaperId: targetPaperId,
      })
    );
  }

  public openCollectionDialog(targetPaperId: string) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.COLLECTION,
        collectionDialogTargetPaperId: targetPaperId,
      })
    );
  }

  public openNewCollectionDialog(targetPaperId?: string) {
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

  public openAuthorListDialog(paper: Paper, profile?: PaperProfile) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.AUTHOR_LIST_DIALOG,
        authorListTargetPaper: paper,
        profile,
      })
    );
  }

  public openPaperFigureDetailDialog(
    paperFigures: PaperFigure[],
    currentPaperFigureIndex: number,
    viewDetailFigureTargetPaperId: string
  ) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.PAPER_FIGURE_DETAIL,
        paperFigures,
        currentPaperFigureIndex,
        viewDetailFigureTargetPaperId,
      })
    );
  }
}

const globalDialogManager = new GlobalDialogManager();

export default globalDialogManager;
