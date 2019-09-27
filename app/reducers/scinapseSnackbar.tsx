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
  actionTicketParams: ActionTicketParams | null;
  id: number | null;
  context: string | null;
}

export const SCINAPSE_SNACK_BAR_INITIAL_STATE: ScinapseSnackbarState = {
  type: null,
  isOpen: false,
  actionTicketParams: null,
  id: null,
  context: null,
};

const scinapseSnackbarSlice = createSlice({
  slice: 'scianpseSnackbar',
  initialState: SCINAPSE_SNACK_BAR_INITIAL_STATE,
  reducers: {
    openSnackbar(
      state,
      action: PayloadAction<{
        type: GLOBAL_SNACKBAR_TYPE;
        actionTicketParams: ActionTicketParams | null;
        id: number | null;
        context: string | null;
      }>
    ) {
      const { type, id, context, actionTicketParams } = action.payload;
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
        id,
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
