import * as uuid from "uuid/v4";
import * as store from "store";
import * as expirePlugin from "store/plugins/expire";
import * as format from "date-fns/format";
import { CurrentUser } from "../../model/currentUser";

export const DEVICE_ID_KEY = "d_id";
export const SESSION_ID_KEY = "s_id";
const USER_ID_KEY = "u_id";
const LIVE_SESSION_LENGTH = 1000 * 60 * 30;

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

  public trackTicket(params: ActionTicketParams) {
    const ticket = this.createTicket(params);
    this.queue.push(ticket);
  }

  public setUserIdToStore(user: CurrentUser) {
    store.set(USER_ID_KEY, user.id);
  }

  public removeUserIdFromStore() {
    store.remove(USER_ID_KEY);
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
    // TODO: Add sending tickets to API logic
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });

    this.queue = [];
  }
}

store.addPlugin(expirePlugin);
const actionTicketManager = new ActionTicketManager();

export default actionTicketManager;
