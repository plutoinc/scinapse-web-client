import * as store from "store";
import ActionTicketManager, {
  DEVICE_ID_KEY,
  SESSION_ID_KEY,
  ActionTicket,
  ActionTicketParams,
  TICKET_QUEUE_KEY,
} from "..";

describe("ActionTicketManager helper", () => {
  const mockTicketParams: ActionTicketParams = {
    pageUrl: "https://scinapse.io",
    actionTarget: "query",
    actionType: "fire",
    actionTag: "Drosophila",
  };

  describe("when the user visit the site at first time", () => {
    beforeEach(() => {
      store.clearAll();
    });

    afterAll(() => {
      store.clearAll();
    });

    describe("checkAndSetDeviceKey method", () => {
      it("should set device key", () => {
        ActionTicketManager.checkAndSetDeviceKey();
        expect(store.get(DEVICE_ID_KEY)).not.toBeUndefined();
      });
    });

    describe("checkSessionAlive method", () => {
      it("should set session key", () => {
        ActionTicketManager.checkSessionAlive();
        expect(store.get(SESSION_ID_KEY)).not.toBeUndefined();
      });

      it("should set session expiring timing", () => {
        ActionTicketManager.checkSessionAlive();
        expect(store.get("__storejs_expire_mixin_s_id")).not.toBeUndefined();
      });
    });
  });

  describe("when the user visited the site at past(within 30 minutes)", () => {
    beforeEach(() => {
      store.clearAll();
    });

    afterAll(() => {
      store.clearAll();
    });

    describe("checkAndSetDeviceKey method", () => {
      it("should not change already decided device key", () => {
        ActionTicketManager.checkAndSetDeviceKey();
        const deviceKey = store.get(DEVICE_ID_KEY);
        ActionTicketManager.checkAndSetDeviceKey();
        expect(store.get(DEVICE_ID_KEY)).toEqual(deviceKey);
      });
    });

    describe("checkSessionAlive method", () => {
      it("should not change already decided session key", () => {
        ActionTicketManager.checkSessionAlive();
        const sessionKey = store.get(SESSION_ID_KEY);
        ActionTicketManager.checkSessionAlive();
        expect(store.get(SESSION_ID_KEY)).toEqual(sessionKey);
      });
    });
  });

  describe("createTicket Method", () => {
    let ticket: ActionTicket;
    let deviceKey: string;
    let sessionKey: string;

    beforeEach(() => {
      store.clearAll();
      ActionTicketManager.checkAndSetDeviceKey();
      ActionTicketManager.checkSessionAlive();
      deviceKey = store.get(DEVICE_ID_KEY);
      sessionKey = store.get(SESSION_ID_KEY);

      ticket = ActionTicketManager.createTicket(mockTicketParams);
    });

    it("should return proper device id", () => {
      expect(ticket.deviceId).toEqual(deviceKey);
    });

    it("should return proper session id", () => {
      expect(ticket.sessionId).toEqual(sessionKey);
    });

    it("should return proper createdAt attribute format(ISO-8601 with time zone)", () => {
      expect(ticket.createdAt).toMatch(
        // From https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
        // tslint:disable-next-line:max-line-length
        /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
      );
    });

    it("should return the given params", () => {
      expect(ticket).toMatchObject(mockTicketParams);
    });
  });

  describe("trackTicket Method", () => {
    beforeEach(() => {
      store.clearAll();
      ActionTicketManager.checkAndSetDeviceKey();
      ActionTicketManager.checkSessionAlive();
    });

    it("should add ticket to ticket queue", () => {
      ActionTicketManager.trackTicket(mockTicketParams);
      expect(ActionTicketManager.queue[0]).toMatchObject(mockTicketParams);
    });

    describe("when queued ticket count is more than MAXIMUM_TICKET_COUNT_IN_QUEUE", () => {
      let originalSendTickets: () => Promise<void>;
      beforeEach(() => {
        store.clearAll();
        ActionTicketManager.queue = [];
        originalSendTickets = ActionTicketManager.sendTickets;
        ActionTicketManager.sendTickets = jest.fn();
        ActionTicketManager.checkAndSetDeviceKey();
        ActionTicketManager.checkSessionAlive();
        ActionTicketManager.trackTicket(mockTicketParams);
        ActionTicketManager.trackTicket(mockTicketParams);
        ActionTicketManager.trackTicket(mockTicketParams);
        ActionTicketManager.trackTicket(mockTicketParams);
        ActionTicketManager.trackTicket(mockTicketParams);
      });

      afterAll(() => {
        ActionTicketManager.sendTickets = originalSendTickets;
        ActionTicketManager.queue = [];
      });

      it("should call sendTickets method", () => {
        ActionTicketManager.trackTicket(mockTicketParams);
        expect((ActionTicketManager.sendTickets as any).mock.calls.length).toBe(1);
      });
    });
  });

  describe("sendTickets method", () => {
    beforeEach(() => {
      store.clearAll();
      ActionTicketManager.checkAndSetDeviceKey();
      ActionTicketManager.checkSessionAlive();
      ActionTicketManager.trackTicket(mockTicketParams);
      ActionTicketManager.trackTicket(mockTicketParams);
    });

    it("should empty the action ticket queue", () => {
      ActionTicketManager.sendTickets();
      expect(ActionTicketManager.queue.length).toEqual(0);
    });
  });

  describe("addToQueue method", () => {
    beforeEach(() => {
      store.clearAll();
      ActionTicketManager.checkAndSetDeviceKey();
      ActionTicketManager.checkSessionAlive();
    });

    it("should add the ticket queue to localStorage", () => {
      const ticket = ActionTicketManager.createTicket(mockTicketParams);
      ActionTicketManager.addToQueue([ticket]);
      expect(store.get(TICKET_QUEUE_KEY)).not.toBeUndefined();
    });
  });

  describe("flushQueue method", () => {
    beforeEach(() => {
      store.clearAll();
      ActionTicketManager.checkAndSetDeviceKey();
      ActionTicketManager.checkSessionAlive();
      const ticket = ActionTicketManager.createTicket(mockTicketParams);
      ActionTicketManager.addToQueue([ticket]);
    });

    it("should add the ticket queue to localStorage", () => {
      ActionTicketManager.flushQueue();
      expect(store.get(TICKET_QUEUE_KEY)).toEqual([]);
    });
  });
});
