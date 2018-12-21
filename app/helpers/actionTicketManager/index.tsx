import axios from "axios";
import * as uuid from "uuid/v4";
import * as store from "store";
import * as expirePlugin from "store/plugins/expire";
import * as format from "date-fns/format";
import { USER_ID_KEY } from "../../middlewares/trackUser";

export const MAXIMUM_TICKET_COUNT_IN_QUEUE = 5;
const TIME_INTERVAL_TO_SEND_TICKETS = 1000 * 5;
export const DEVICE_ID_KEY = "d_id";
export const SESSION_ID_KEY = "s_id";
export const TICKET_QUEUE_KEY = "a_q";
const LIVE_SESSION_LENGTH = 1000 * 60 * 30;
const DESTINATION_URL = "https://gxazpbvvy7.execute-api.us-east-1.amazonaws.com/dev/actionticket";

export interface ActionTicket extends ActionTicketParams {
  deviceId: string;
  sessionId: string;
  createdAt: string;
  userId: string | null;
}

export interface ActionTicketParams {
  pageType: string;
  pageUrl: string;
  actionTarget: string;
  actionType: "fire" | "view";
  actionTag: string;
}

class ActionTicketManager {
  public queue: ActionTicket[] = [];
  private sentLastTickets: boolean = false;

  constructor() {
    window.addEventListener("beforeunload", () => {
      this.sendTicketsBeforeCloseSession();
    });
    window.addEventListener("unload", () => {
      this.sendTicketsBeforeCloseSession();
    });
  }

  public trackTicket(params: ActionTicketParams) {
    const ticket = this.createTicket(params);
    this.addToQueue([ticket]);

    if (this.queue.length > MAXIMUM_TICKET_COUNT_IN_QUEUE) {
      this.sendTickets();
    }
  }

  public addToQueue(tickets: ActionTicket[]) {
    this.queue = [...this.queue, ...tickets];

    store.set(TICKET_QUEUE_KEY, this.queue);
  }

  public checkAndSetDeviceKey() {
    const deviceKey = store.get(DEVICE_ID_KEY);
    if (!deviceKey) {
      store.set(DEVICE_ID_KEY, uuid());
    }
  }

  public checkSessionAlive() {
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

  public createTicket(params: ActionTicketParams): ActionTicket {
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

  public async sendTickets() {
    const targetTickets = this.queue;
    if (this.queue.length > 0) {
      this.flushQueue();
      try {
        console.log("========== SENT TICKETS!! ========== ");
        const res = await axios.post(DESTINATION_URL, encodeURIComponent(JSON.stringify(targetTickets)), {
          headers: {
            "Content-Type": "text/plain;charset=UTF-8",
          },
        });
        console.log(res);
      } catch (err) {
        console.error(err);
        this.addToQueue(targetTickets);
      }
    }
  }

  public flushQueue() {
    this.queue = [];
    store.set(TICKET_QUEUE_KEY, this.queue);
  }

  private sendTicketsBeforeCloseSession() {
    if (this.sentLastTickets || this.queue.length === 0) {
      return;
    }

    if (typeof navigator !== undefined && navigator.sendBeacon) {
      // TODO: Handle flush when below it's true only
      navigator.sendBeacon(DESTINATION_URL, encodeURIComponent(JSON.stringify(this.queue)));
      this.flushQueue();
    }
  }
}

store.addPlugin(expirePlugin);
const actionTicketManager = new ActionTicketManager();

setInterval(() => {
  actionTicketManager.sendTickets();
}, TIME_INTERVAL_TO_SEND_TICKETS);

export default actionTicketManager;
