import axios from "axios";
import * as uuid from "uuid/v4";
import * as store from "store";
import * as expirePlugin from "store/plugins/expire";
import EnvChecker from "../envChecker";
import ActionTicket, { ActionTicketParams, PageType, FinalActionTicket } from "./actionTicket";

export const MAXIMUM_TICKET_COUNT_IN_QUEUE = 5;
const TIME_INTERVAL_TO_SEND_TICKETS = 1000 * 5;
export const DEVICE_ID_KEY = "d_id";
export const SESSION_ID_KEY = "s_id";
export const TICKET_QUEUE_KEY = "a_q";
export const DEAD_LETTER_QUEUE_KEY = "d_a_q";
const LIVE_SESSION_LENGTH = 1000 * 60 * 30;
const MAXIMUM_RETRY_COUNT = 3;
const DESTINATION_URL = "https://gxazpbvvy7.execute-api.us-east-1.amazonaws.com/dev/actionticket";
// const DESTINATION_URL = "http://localhost:3000";

class ActionTicketManager {
  public queue: ActionTicket[] = [];
  private sentLastTickets: boolean = false;
  private pageType: PageType;

  constructor() {
    if (!EnvChecker.isOnServer()) {
      window.addEventListener("beforeunload", () => {
        this.sendTicketsBeforeCloseSession();
      });
      window.addEventListener("unload", () => {
        this.sendTicketsBeforeCloseSession();
      });

      this.checkAndSetDeviceKey();
      this.tryToSendDeadTickets();
    }
  }

  public setPageType(pageType: PageType) {
    this.pageType = pageType;
  }

  public trackTicket(params: ActionTicketParams) {
    if (!EnvChecker.isOnServer()) {
      this.checkSessionAlive();
      const ticket = new ActionTicket({ ...params, pageType: this.pageType });
      this.addToQueue([ticket]);

      if (this.queue.length > MAXIMUM_TICKET_COUNT_IN_QUEUE) {
        this.sendTickets();
      }
    }
  }

  public async sendTickets() {
    if (this.queue.length > 0) {
      const targetTickets = this.queue;
      this.flushQueue();
      try {
        await this.postTickets(targetTickets);
      } catch (err) {
        targetTickets.forEach(ticket => ticket.increaseErrorCount());

        const deadTickets = targetTickets.filter(
          ticket => ticket.errorCount && ticket.errorCount > MAXIMUM_RETRY_COUNT
        );
        this.addToDeadLetterQueue(deadTickets);

        const retryTickets = targetTickets.filter(
          ticket => !ticket.errorCount || (ticket.errorCount && ticket.errorCount <= MAXIMUM_RETRY_COUNT)
        );
        this.addToQueue(retryTickets);
      }
    }
  }

  public flushQueue() {
    this.queue = [];
    store.set(TICKET_QUEUE_KEY, this.queue);
  }

  private addToDeadLetterQueue(tickets: ActionTicket[]) {
    const deadQueue = store.get(DEAD_LETTER_QUEUE_KEY) || [];
    store.set(DEAD_LETTER_QUEUE_KEY, [...deadQueue, ...tickets.map(ticket => ticket.getTicketWithoutMeta())]);
  }

  private addToQueue(tickets: ActionTicket[]) {
    this.queue = [...this.queue, ...tickets];

    store.set(TICKET_QUEUE_KEY, this.queue);
  }

  private checkAndSetDeviceKey() {
    const deviceKey = store.get(DEVICE_ID_KEY);
    if (!deviceKey) {
      store.set(DEVICE_ID_KEY, uuid());
    }
  }

  private checkSessionAlive() {
    (store as any).removeExpiredKeys();
    const sessionKey: string | undefined = store.get(SESSION_ID_KEY);
    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    if (!sessionKey) {
      (store as any).set(SESSION_ID_KEY, uuid(), currentTime + LIVE_SESSION_LENGTH);
    } else {
      (store as any).set(SESSION_ID_KEY, sessionKey, currentTime + LIVE_SESSION_LENGTH);
    }
  }

  private async postTickets(tickets: ActionTicket[]) {
    await axios.post(
      DESTINATION_URL,
      encodeURIComponent(JSON.stringify(tickets.map(ticket => ticket.getTicketWithoutMeta()))),
      {
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
      }
    );
  }

  private async tryToSendDeadTickets() {
    const rawDeadTickets: FinalActionTicket[] | undefined = store.get(DEAD_LETTER_QUEUE_KEY);

    const deadTickets = rawDeadTickets && rawDeadTickets.map(ticket => new ActionTicket(ticket));
    if (deadTickets && deadTickets.length > 0) {
      try {
        await this.postTickets(deadTickets);
        store.set(DEAD_LETTER_QUEUE_KEY, []);
      } catch (err) {
        console.error("FAILED TO SEND DEAD TICKETS", err);
      }
    }
  }

  private sendTicketsBeforeCloseSession() {
    if (this.sentLastTickets || this.sentLastTickets || this.queue.length === 0) {
      return;
    }

    const encodedTickets = encodeURIComponent(JSON.stringify(this.queue.map(ticket => ticket.getTicketWithoutMeta())));

    if (typeof navigator !== undefined && navigator.sendBeacon) {
      const success = navigator.sendBeacon(DESTINATION_URL, encodedTickets);
      this.sentLastTickets = success;
    } else {
      // This is needed for IE
      const xhr = new XMLHttpRequest();
      xhr.open("POST", DESTINATION_URL, false);
      xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      xhr.send(encodedTickets);
      if (xhr.status === 200) {
        this.sentLastTickets = true;
      }
    }
  }
}

store.addPlugin(expirePlugin);
const actionTicketManager = new ActionTicketManager();

if (!EnvChecker.isOnServer()) {
  setInterval(() => {
    actionTicketManager.sendTickets();
  }, TIME_INTERVAL_TO_SEND_TICKETS);
}

export default actionTicketManager;
