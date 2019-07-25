import { ACTION_TYPES, Actions } from '../../actions/actionTypes';
import { AvailableCitationType } from '../../containers/paperShow/records';
import { Collection } from '../../model/collection';
import { Paper, PaperFigure } from '../../model/paper';
import { SIGN_UP_STEP } from '../auth/signUp/types';
import { OAuthCheckParams } from '../../api/types/auth';
import { SignUpConversionExpTicketContext } from '../../constants/abTest';

export enum GLOBAL_DIALOG_TYPE {
  SIGN_IN,
  SIGN_UP,
  WALLET,
  VERIFICATION_NEEDED,
  FINAL_SIGN_UP_WITH_EMAIL,
  FINAL_SIGN_UP_WITH_SOCIAL,
  SURVEY_FORM,
  RESET_PASSWORD,
  COLLECTION,
  NEW_COLLECTION,
  EDIT_COLLECTION,
  CITATION,
  AUTHOR_LIST_DIALOG,
  ADD_PUBLICATIONS_TO_AUTHOR_DIALOG,
  PAPER_FIGURE_DETAIL,
}

export interface DialogState
  extends Readonly<{
      isLoading: boolean;
      hasError: boolean;
      isOpen: boolean;
      type: GLOBAL_DIALOG_TYPE | null;

      signUpStep: SIGN_UP_STEP | null;
      oauthResult: OAuthCheckParams | null;
      userActionType: Scinapse.ActionTicket.ActionTagType | undefined;
      authContext: SignUpConversionExpTicketContext | undefined;

      citationPaperId: number | undefined;
      citationText: string;
      isLoadingCitationText: boolean;
      activeCitationTab: AvailableCitationType;

      isLoadingMyCollections: boolean;
      hasErrorToCollectionDialog: boolean;
      myCollectionIds: number[];
      collectionDialogTargetPaperId: number | undefined;

      collection: Collection | undefined;

      authorListTargetPaper: Paper | undefined;

      isBlocked: boolean | undefined;

      nextSignUpStep: string | undefined;

      paperFigures: PaperFigure[] | undefined;
      currentPaperFigureIndex: number | undefined;
      viewDetailFigureTargetPaperId: number | undefined;
    }> {} // TODO: remove below attribute after finishing the experiment

export const DIALOG_INITIAL_STATE: DialogState = {
  isLoading: false,
  hasError: false,
  isOpen: false,
  type: null,
  // sign up dialog
  signUpStep: null,
  oauthResult: null,
  userActionType: undefined,
  authContext: undefined,
  // citation dialog
  citationPaperId: 0,
  citationText: '',
  isLoadingCitationText: false,
  activeCitationTab: AvailableCitationType.BIBTEX,
  // collection dialog
  isLoadingMyCollections: false,
  hasErrorToCollectionDialog: false,
  myCollectionIds: [],
  collectionDialogTargetPaperId: undefined,
  // collection edit dialog
  collection: undefined,
  // author list dialog
  authorListTargetPaper: undefined,
  isBlocked: undefined,
  nextSignUpStep: undefined,
  paperFigures: undefined,
  currentPaperFigureIndex: undefined,
  viewDetailFigureTargetPaperId: undefined,
};

export function reducer(state: DialogState = DIALOG_INITIAL_STATE, action: Actions): DialogState {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_DIALOG_OPEN: {
      return {
        ...state,
        isOpen: true,
        type: action.payload.type,
        collectionDialogTargetPaperId: action.payload.collectionDialogTargetPaperId,
        citationPaperId: action.payload.citationDialogTargetPaperId,
        collection: action.payload.collection,
        authorListTargetPaper: action.payload.authorListTargetPaper,
        userActionType: action.payload.userActionType,
        authContext: action.payload.authContext,
        isBlocked: action.payload.isBlocked,
        nextSignUpStep: action.payload.nextSignUpStep,
        paperFigures: action.payload.paperFigures,
        currentPaperFigureIndex: action.payload.currentPaperFigureIndex,
        viewDetailFigureTargetPaperId: action.payload.viewDetailFigureTargetPaperId,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_CLOSE: {
      return DIALOG_INITIAL_STATE;
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SET_BLOCKED: {
      return { ...state, isBlocked: true };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_UNSET_BLOCKED: {
      return { ...state, isBlocked: false };
    }

    case ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE: {
      return {
        ...state,
        type: action.payload.type,
        signUpStep: action.payload.signUpStep || null,
        oauthResult: action.payload.oauthResult || null,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingMyCollections: true,
        hasErrorToCollectionDialog: false,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS: {
      return {
        ...state,
        myCollectionIds: action.payload.collectionIds,
        isLoadingMyCollections: false,
        hasErrorToCollectionDialog: false,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingMyCollections: false,
        hasErrorToCollectionDialog: true,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_POST_COLLECTION: {
      return {
        ...state,
        isLoadingMyCollections: true,
        hasErrorToCollectionDialog: false,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION: {
      return {
        ...state,
        myCollectionIds: [action.payload.collectionId, ...state.myCollectionIds],
        isLoadingMyCollections: false,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION: {
      return {
        ...state,
        isLoadingMyCollections: false,
        hasErrorToCollectionDialog: true,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_GET_CITATION_TEXT: {
      return {
        ...state,
        isLoadingCitationText: true,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_GET_CITATION_TEXT: {
      return {
        ...state,
        isLoadingCitationText: false,
        citationText: action.payload.citationText,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_GET_CITATION_TEXT: {
      return {
        ...state,
        isLoadingCitationText: false,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_CLICK_CITATION_TAB: {
      return {
        ...state,
        activeCitationTab: action.payload.tab,
      };
    }

    default:
      return state;
  }
}
