import { JOURNAL_SHOW_INITIAL_STATE, JournalShowState, reducer } from '../reducer';
import { ACTION_TYPES } from '../../../actions/actionTypes';

describe('JournalShow reducer', () => {
  let mockAction: any;
  let mockState: JournalShowState;
  let state: JournalShowState;

  describe('when receive JOURNAL_SHOW_START_TO_GET_JOURNAL', () => {
    it('should set failedToLoadJournal state to false', () => {
      mockState = { ...JOURNAL_SHOW_INITIAL_STATE, pageErrorCode: null };
      mockAction = {
        type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_JOURNAL,
      };

      state = reducer(mockState, mockAction);
      expect(state.pageErrorCode).toBeFalsy();
    });

    it('should set isLoadingJournal state to true', () => {
      mockState = { ...JOURNAL_SHOW_INITIAL_STATE, pageErrorCode: null };
      mockAction = {
        type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_JOURNAL,
      };

      state = reducer(mockState, mockAction);
      expect(state.isLoadingJournal).toBeTruthy();
    });
  });

  describe('when receive JOURNAL_SHOW_FAILED_TO_GET_JOURNAL', () => {
    it('should set isLoadingJournal state to false', () => {
      mockState = { ...JOURNAL_SHOW_INITIAL_STATE, isLoadingJournal: true };
      mockAction = {
        type: ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_JOURNAL,
        payload: {
          statusCode: 400,
        },
      };

      state = reducer(mockState, mockAction);
      expect(state.isLoadingJournal).toBeFalsy();
    });
  });

  describe('when receive JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL', () => {
    beforeEach(() => {
      mockState = { ...JOURNAL_SHOW_INITIAL_STATE, isLoadingJournal: true };
      mockAction = {
        type: ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL,
        payload: {
          journalId: 123,
        },
      };
    });
    it("should set journalId state to payload's journalId", () => {
      state = reducer(mockState, mockAction);
      expect(state.journalId).toEqual(123);
    });

    it('should set isLoadingJournal state to false', () => {
      state = reducer(mockState, mockAction);
      expect(state.isLoadingJournal).toBeFalsy();
    });
  });

  describe('when receive JOURNAL_SHOW_START_TO_GET_PAPERS', () => {
    beforeEach(() => {
      mockState = { ...JOURNAL_SHOW_INITIAL_STATE, failedToLoadPapers: true };
      mockAction = {
        type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_PAPERS,
      };
    });

    it('should set failedToLoadPapers state to false', () => {
      state = reducer(mockState, mockAction);
      expect(state.failedToLoadPapers).toBeFalsy();
    });

    it('should set isLoadingPapers state to true', () => {
      state = reducer(mockState, mockAction);
      expect(state.isLoadingPapers).toBeTruthy();
    });
  });

  describe('when receive JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS', () => {
    const mockPaperIds = [123];
    beforeEach(() => {
      mockState = { ...JOURNAL_SHOW_INITIAL_STATE, isLoadingPapers: true };
      mockAction = {
        type: ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          paperIds: mockPaperIds,
          totalPage: 1,
          currentPage: 1,
          paperCount: 1,
        },
      };
    });

    it('should set isLoadingPapers state to false', () => {
      state = reducer(mockState, mockAction);
      expect(state.isLoadingPapers).toBeFalsy();
    });

    it("should set paperIds state to payload's paperIds", () => {
      state = reducer(mockState, mockAction);
      expect(state.paperIds).toEqual(mockPaperIds);
    });

    it("should set paperTotalPage state to payload's totalPage", () => {
      state = reducer(mockState, mockAction);
      expect(state.paperTotalPage).toEqual(1);
    });

    it("should set paperCurrentPage state to payload's currentPage", () => {
      state = reducer(mockState, mockAction);
      expect(state.paperCurrentPage).toEqual(1);
    });

    it("should set paperCount state to payload's paperCount", () => {
      state = reducer(mockState, mockAction);
      expect(state.totalPaperCount).toEqual(1);
    });
  });

  describe('when receive JOURNAL_SHOW_FAILED_TO_GET_PAPERS', () => {
    beforeEach(() => {
      mockState = { ...JOURNAL_SHOW_INITIAL_STATE, isLoadingPapers: true };
      mockAction = {
        type: ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_PAPERS,
      };
    });

    it('should set failedToLoadPapers state to true', () => {
      state = reducer(mockState, mockAction);
      expect(state.failedToLoadPapers).toBeTruthy();
    });

    it('should set isLoadingPapers state to false', () => {
      state = reducer(mockState, mockAction);
      expect(state.isLoadingPapers).toBeFalsy();
    });
  });
});
