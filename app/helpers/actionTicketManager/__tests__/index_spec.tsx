import * as store from "store";
import ActionTicketManager, { DEVICE_ID_KEY, SESSION_ID_KEY, ActionTicket, ActionTicketParams } from "..";

describe("ActionTicketManager helper", () => {
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
    const mockTicketParams: ActionTicketParams = {
      pageType: "home",
      pageUrl: "https://scinapse.io",
      actionTarget: "query",
      actionType: "fire",
      actionTag: "Drosophila",
    };
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
    const mockTicketParams: ActionTicketParams = {
      pageType: "home",
      pageUrl: "https://scinapse.io",
      actionTarget: "query",
      actionType: "fire",
      actionTag: "Drosophila",
    };

    beforeEach(() => {
      store.clearAll();
      ActionTicketManager.checkAndSetDeviceKey();
      ActionTicketManager.checkSessionAlive();
    });

    it("should add ticket to ticket queue", () => {
      ActionTicketManager.trackTicket(mockTicketParams);
      expect(ActionTicketManager.queue[0]).toMatchObject(mockTicketParams);
    });
  });

  describe("sendTickets method", () => {
    const mockTicketParams: ActionTicketParams = {
      pageType: "home",
      pageUrl: "https://scinapse.io",
      actionTarget: "query",
      actionType: "fire",
      actionTag: "Drosophila",
    };

    beforeEach(() => {
      store.clearAll();
      ActionTicketManager.checkAndSetDeviceKey();
      ActionTicketManager.checkSessionAlive();
      ActionTicketManager.trackTicket(mockTicketParams);
      ActionTicketManager.trackTicket(mockTicketParams);
      ActionTicketManager.trackTicket(mockTicketParams);
    });

    it("should empty the action ticket queue", async () => {
      await ActionTicketManager.sendTickets();
      expect(ActionTicketManager.queue.length).toEqual(0);
    });
  });
});
