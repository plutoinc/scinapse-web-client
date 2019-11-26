import * as store from 'store';
import ActionTicketManager from '..';
import ActionTicket, { ActionTicketParams, FinalActionTicket } from '../actionTicket';
import { DEVICE_ID_KEY, SESSION_ID_KEY } from '../../../constants/actionTicket';

describe('ActionTicketManager helper', () => {
  const mockTicketParams: ActionTicketParams = {
    pageType: 'paperShow',
    actionType: 'fire',
    actionTag: 'query',
    actionArea: 'topBar',
    actionLabel: 'Hello World',
  };

  describe('trackTicket Method', () => {
    let ticket: FinalActionTicket;
    let deviceKey: string;
    let sessionKey: string;

    beforeAll(() => {
      ActionTicketManager.trackTicket(mockTicketParams);
    });

    afterAll(() => {
      store.clearAll();
    });

    beforeEach(() => {
      ticket = new ActionTicket(mockTicketParams).getTicketWithoutMeta();
      deviceKey = store.get(DEVICE_ID_KEY);
      sessionKey = store.get(SESSION_ID_KEY);
    });

    it('should add ticket to ticket queue', () => {
      expect(ticket).toMatchObject(mockTicketParams);
    });

    it('should return proper device id', () => {
      expect(ticket.deviceId).toEqual(deviceKey);
    });

    it('should return proper session id', () => {
      expect(ticket.sessionId).toEqual(sessionKey);
    });

    it('should return proper createdAt attribute format(ISO-8601 with time zone)', () => {
      expect(ticket.createdAt).toMatch(
        // From https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
        // tslint:disable-next-line:max-line-length
        /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))/
      );
    });

    it('should return the given params', () => {
      expect(ticket).toMatchObject(mockTicketParams);
    });

    describe('when queued ticket count is more than MAXIMUM_TICKET_COUNT_IN_QUEUE', () => {
      let originalSendTickets: () => Promise<void>;
      beforeEach(() => {
        store.clearAll();
        ActionTicketManager.flushQueue();
        originalSendTickets = ActionTicketManager.sendTickets;
        ActionTicketManager.sendTickets = jest.fn();
        ActionTicketManager.trackTicket(mockTicketParams);
        ActionTicketManager.trackTicket(mockTicketParams);
        ActionTicketManager.trackTicket(mockTicketParams);
        ActionTicketManager.trackTicket(mockTicketParams);
        ActionTicketManager.trackTicket(mockTicketParams);
      });

      afterAll(() => {
        ActionTicketManager.sendTickets = originalSendTickets;
        ActionTicketManager.flushQueue();
      });

      it('should call sendTickets method', () => {
        ActionTicketManager.trackTicket(mockTicketParams);
        expect((ActionTicketManager.sendTickets as any).mock.calls.length).toBe(1);
      });
    });
  });

  describe('sendTickets method', () => {
    beforeEach(() => {
      store.clearAll();
      ActionTicketManager.trackTicket(mockTicketParams);
      ActionTicketManager.trackTicket(mockTicketParams);
    });

    it('should empty the action ticket queue', () => {
      ActionTicketManager.sendTickets();
      expect(ActionTicketManager.queue.length).toEqual(0);
    });
  });
});
