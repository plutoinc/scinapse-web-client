import * as uuid from "uuid/v4";
import * as store from "store";
import * as expirePlugin from "store/plugins/expire";
import { CurrentUser } from "../../model/currentUser";

const DEVICE_ID_KEY = "d_id";
const SESSION_ID_KEY = "s_id";
const USER_ID_KEY = "u_id";
const LIVE_SESSION_LENGTH = 1000 * 60 * 30;

class ActionTicketManager {
  public setUserIdToStore(user: CurrentUser) {
    console.log("SET USER ID");
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
}

store.addPlugin(expirePlugin);
const actionTicketManager = new ActionTicketManager();

export default actionTicketManager;
