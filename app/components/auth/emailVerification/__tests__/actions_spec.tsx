jest.mock('../../../../api/auth');
jest.mock('normalize.css', () => {});
jest.mock('../../../../helpers/makePlutoToastAction');
jest.unmock('../actions');

import * as Actions from '../actions';
import { generateMockStore } from '../../../../__tests__/mockStore';
import { ACTION_TYPES } from '../../../../actions/actionTypes';
import { closeDialog } from '../../../dialog/actions';

describe('emailVerification actions', () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore();
    store.clearActions();
  });

  describe('verifyToken action', () => {
    const mockToken = 'test';

    it('should return EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN action', () => {
      store.dispatch(Actions.verifyToken(mockToken));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN,
      });
    });

    it('should return EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN action', async () => {
      await store.dispatch(Actions.verifyToken(mockToken));
      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN,
      });
    });
  });

  describe('resendVerificationEmail action', () => {
    const mockEmail = 'hj@naver.com';
    const mockIsDialog = false;

    it('should return EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL action', () => {
      store.dispatch(Actions.resendVerificationEmail(mockEmail, mockIsDialog));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL,
      });
    });

    it('should return EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL action', async () => {
      await store.dispatch(Actions.resendVerificationEmail(mockEmail, mockIsDialog));
      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL,
      });
    });

    it('should return closeDialog action if isDialog is true', async () => {
      const mockTrueIsDialog = true;
      await store.dispatch(Actions.resendVerificationEmail(mockEmail, mockTrueIsDialog));
      const actions = store.getActions();
      expect(actions[2]).toEqual(closeDialog());
    });
  });
});
