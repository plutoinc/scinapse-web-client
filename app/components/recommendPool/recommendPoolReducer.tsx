import { createSlice, PayloadAction } from 'redux-starter-kit';
import { uniq } from 'lodash';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { BASED_ACTIVITY_PAPER_IDS_FOR_NON_USER_KEY } from './recommendPoolConstants';
const store = require('store');

export interface RecommendPoolState {
  isOpen: boolean;
  actionArea: string;
  tempPaperIds: number[];
}

export const RECOMMEND_POOL_INITIAL_STATE: RecommendPoolState = {
  isOpen: false,
  actionArea: '',
  tempPaperIds: store.get(BASED_ACTIVITY_PAPER_IDS_FOR_NON_USER_KEY) || [],
};

const recommendPoolSlice = createSlice({
  slice: 'recommendPool',
  initialState: RECOMMEND_POOL_INITIAL_STATE,
  reducers: {
    addPaperToTempPool: (state, action: PayloadAction<{ paperId: number }>) => {
      const newPaperIds = uniq([action.payload.paperId, ...state.tempPaperIds]).slice(0, 20);
      state.tempPaperIds = newPaperIds;
      store.set(BASED_ACTIVITY_PAPER_IDS_FOR_NON_USER_KEY, newPaperIds);
    },
    openRecommendPapersDialog(
      state,
      action: PayloadAction<{
        pageType: Scinapse.ActionTicket.PageType;
        actionArea: string;
      }>
    ) {
      ActionTicketManager.trackTicket({
        pageType: action.payload.pageType,
        actionType: 'view',
        actionArea: 'knowledgeBaseNoti',
        actionTag: 'viewKnowledgeBaseNoti',
        actionLabel: action.payload.actionArea,
      });
      state.isOpen = true;
      state.actionArea = action.payload.actionArea;
    },
    closeRecommendPapersDialog(state) {
      state.isOpen = false;
      state.actionArea = '';
    },
  },
});

export const { addPaperToTempPool, openRecommendPapersDialog, closeRecommendPapersDialog } = recommendPoolSlice.actions;

export default recommendPoolSlice.reducer;
