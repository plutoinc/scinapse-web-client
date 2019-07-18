import StoreManager from '../../store/store';
import { ActionCreators } from '../../actions/actionTypes';
import { GLOBAL_DIALOG_TYPE } from '../../components/dialog/reducer';
import { Collection } from '../../model/collection';
import { Paper, PaperFigure } from '../../model/paper';
import { SignUpConversionExpTicketContext as AuthContext } from '../../constants/abTest';

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

  public openSurveyFormDialog(nextStep?: string) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.SURVEY_FORM,
        isBlocked: true,
        nextSignUpStep: nextStep ? nextStep : 'email',
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

  public openPaperFigureDetailDialog(paperFigures: PaperFigure[], currentPaperFigureIndex: number) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.PAPER_FIGURE_DETAIL,
        paperFigures,
        currentPaperFigureIndex,
      })
    );
  }
}

const globalDialogManager = new GlobalDialogManager();

export default globalDialogManager;
