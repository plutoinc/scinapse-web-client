import * as store from "store";
import * as format from "date-fns/format";
import { USER_ID_KEY } from "../../middlewares/trackUser";
import { ActionTicketParams, DEVICE_ID_KEY, SESSION_ID_KEY, FinalActionTicket } from ".";

export default class ActionTicket {
  private deviceId = store.get(DEVICE_ID_KEY);
  private sessionId = store.get(SESSION_ID_KEY);
  private userId = store.get(USER_ID_KEY) || null;
  private createdAt = format(new Date());
  private pageUrl: string;
  private actionTarget: string | null;
  private actionType: "fire" | "view";
  private actionTag: string | null;
  private _errorCount = 0;

  public constructor(params: ActionTicketParams) {
    this.pageUrl = params.pageUrl;
    this.actionTarget = params.actionTarget;
    this.actionType = params.actionType;
    this.actionTag = params.actionTag;
  }

  public getTicketWithoutMeta(): FinalActionTicket {
    return {
      deviceId: this.deviceId,
      sessionId: this.sessionId,
      createdAt: this.createdAt,
      userId: this.userId,
      pageUrl: this.pageUrl,
      actionTarget: this.actionTarget,
      actionType: this.actionType,
      actionTag: this.actionTag,
    };
  }

  public increaseErrorCount() {
    this._errorCount += 1;
  }

  get errorCount() {
    return this._errorCount;
  }
}
