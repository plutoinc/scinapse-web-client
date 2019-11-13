import { createSlice, PayloadAction } from 'redux-starter-kit';
import ActionTicketManager from '../helpers/actionTicketManager';
import { ActionTicketParams } from '../helpers/actionTicketManager/actionTicket';

export enum GLOBAL_SNACKBAR_TYPE {
  COLLECTION_SAVED,
  CREATE_KEYWORD_ALERT,
}

export interface ScinapseSnackbarState {
  type: GLOBAL_SNACKBAR_TYPE | null;
  isOpen: boolean;
  collectionId: string | null;
  context: string | null;
}

export const SCINAPSE_SNACK_BAR_INITIAL_STATE: ScinapseSnackbarState = {
  type: null,
  isOpen: false,
  collectionId: null,
  context: null,
};

const scinapseSnackbarSlice = createSlice({
  name: 'scinapseSnackbar',
  initialState: SCINAPSE_SNACK_BAR_INITIAL_STATE,
  reducers: {
    openSnackbar(
      state,
      action: PayloadAction<{
        type: GLOBAL_SNACKBAR_TYPE;
        collectionId: string | null;
        context: string | null;
        actionTicketParams?: ActionTicketParams;
      }>
    ) {
      const { type, collectionId, context, actionTicketParams } = action.payload;
      if (!!actionTicketParams) {
        const { pageType, actionType, actionArea, actionTag, actionLabel } = actionTicketParams;
        ActionTicketManager.trackTicket({
          pageType,
          actionType,
          actionArea,
          actionTag,
          actionLabel,
        });
      }

      return {
        ...state,
        type: type,
        isOpen: true,
        collectionId: collectionId,
        context,
      };
    },
    closeSnackbar(state) {
      return {
        ...state,
        isOpen: false,
      };
    },
  },
});

export const { openSnackbar, closeSnackbar } = scinapseSnackbarSlice.actions;

export default scinapseSnackbarSlice.reducer;
