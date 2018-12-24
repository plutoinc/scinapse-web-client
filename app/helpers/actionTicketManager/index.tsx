import axios from "axios";
import * as uuid from "uuid/v4";
import * as store from "store";
import * as expirePlugin from "store/plugins/expire";
import * as format from "date-fns/format";
import { USER_ID_KEY } from "../../middlewares/trackUser";
import EnvChecker from "../envChecker";

export const MAXIMUM_TICKET_COUNT_IN_QUEUE = 5;
const TIME_INTERVAL_TO_SEND_TICKETS = 1000 * 5;
export const DEVICE_ID_KEY = "d_id";
export const SESSION_ID_KEY = "s_id";
export const TICKET_QUEUE_KEY = "a_q";
export const DEAD_LETTER_QUEUE_KEY = "d_a_q";
const LIVE_SESSION_LENGTH = 1000 * 60 * 30;
const MAXIMUM_RETRY_COUNT = 3;
const DESTINATION_URL = "https://gxazpbvvy7.execute-api.us-east-1.amazonaws.com/dev/actionticket";

type Ticket = FinalActionTicket & ActionTicketMeta;
interface FinalActionTicket extends ActionTicketParams {
  deviceId: string;
  sessionId: string;
  createdAt: string;
  userId: string | null;
}

interface ActionTicketMeta {
  errorCount?: number;
}

export interface ActionTicketParams {
  pageUrl: string;
  actionTarget: string | null;
  actionType: "fire" | "view";
  actionTag: string | null;
}

class ActionTicket {
  private ticket: Ticket;
  public constructor(ticketParams: ActionTicketParams) {
    const deviceId = store.get(DEVICE_ID_KEY);
    const sessionId = store.get(SESSION_ID_KEY);
    const userId = store.get(USER_ID_KEY) || null;

    this.ticket = {
      ...ticketParams,
      errorCount: 0,
      deviceId,
      sessionId,
      userId,
      createdAt: format(new Date()),
    };
  }
}

class ActionTicketManager {
  public queue: Ticket[] = [];
  private sentLastTickets: boolean = false;

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

  public trackTicket(params: ActionTicketParams) {
    if (!EnvChecker.isOnServer()) {
      const ticket = this.createTicket(params);
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
        const deadTickets = targetTickets.filter(
          ticket => ticket.errorCount && ticket.errorCount > MAXIMUM_RETRY_COUNT
        );
        const deadQueue = store.get(DEAD_LETTER_QUEUE_KEY) || [];
        store.set(DEAD_LETTER_QUEUE_KEY, [...deadQueue, ...deadTickets]);

        const retryTickets = targetTickets.filter(
          ticket => !ticket.errorCount || (ticket.errorCount && ticket.errorCount <= MAXIMUM_RETRY_COUNT)
        );
        this.addToQueue(
          retryTickets.map(ticket => ({ ...ticket, errorCount: ticket.errorCount ? ticket.errorCount + 1 : 1 }))
        );
      }
    }
  }

  public flushQueue() {
    this.queue = [];
    store.set(TICKET_QUEUE_KEY, this.queue);
  }

  private addToQueue(tickets: Ticket[]) {
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

  private createTicket(params: ActionTicketParams): Ticket {
    this.checkSessionAlive();
    const deviceId = store.get(DEVICE_ID_KEY);
    const sessionId = store.get(SESSION_ID_KEY);
    const userId = store.get(USER_ID_KEY) || null;

    return {
      ...params,
      deviceId,
      sessionId,
      userId,
      createdAt: format(new Date()),
    };
  }

  private getTicketsWithoutMeta(tickets: Ticket[]): FinalActionTicket[] {
    return tickets.map(ticket => ({
      deviceId: ticket.deviceId,
      sessionId: ticket.sessionId,
      createdAt: ticket.createdAt,
      userId: ticket.userId,
      pageUrl: ticket.pageUrl,
      actionTarget: ticket.actionTarget,
      actionType: ticket.actionType,
      actionTag: ticket.actionTag,
    }));
  }

  private async postTickets(tickets: Ticket[]) {
    await axios.post(DESTINATION_URL, encodeURIComponent(JSON.stringify(this.getTicketsWithoutMeta(tickets))), {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
    });
  }

  private async tryToSendDeadTickets() {
    const deadTickets = store.get(DEAD_LETTER_QUEUE_KEY);
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

    const encodedTickets = encodeURIComponent(JSON.stringify(this.getTicketsWithoutMeta(this.queue)));

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
