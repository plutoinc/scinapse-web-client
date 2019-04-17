import * as store from "store";
import * as format from "date-fns/format";
import EnvChecker from "../envChecker";
import { DEVICE_ID_KEY, SESSION_ID_KEY, USER_ID_KEY } from "../../constants/actionTicket";

export interface ActionTicketParams {
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType | null;
  actionType: "fire" | "view";
  actionTag: Scinapse.ActionTicket.ActionTagType;
  actionLabel: string | null;
  expName?: string;
  expUser?: string;
}

export interface FinalActionTicket extends ActionTicketParams {
  pageUrl: string;
  pageType: Scinapse.ActionTicket.PageType;
  deviceId: string;
  sessionId: string;
  createdAt: string;
  userId: string | null;
  clientVersion: string | null;
  referral: string;
  expName: string;
  expUser: string;
}

export default class ActionTicket {
  private deviceId = store.get(DEVICE_ID_KEY);
  private sessionId = store.get(SESSION_ID_KEY);
  private userId = store.get(USER_ID_KEY) || null;
  private createdAt = format(new Date());
  private pageUrl: string;
  private actionType: "fire" | "view";
  private actionTag: Scinapse.ActionTicket.ActionTagType;
  private actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType | null;
  private pageType: Scinapse.ActionTicket.PageType;
  private actionLabel: string | null;
  private _errorCount = 0;
  private expName: string;
  private expUser: string;

  public constructor(params: ActionTicketParams) {
    if (!EnvChecker.isOnServer()) {
      this.pageUrl = window.location.href;
      this.actionType = params.actionType;
      this.actionTag = params.actionTag;
      this.actionArea = params.actionArea;
      this.pageType = params.pageType;
      this.actionLabel = params.actionLabel;
      this.expName = params.expName || "";
    }
  }

  public getTicketWithoutMeta(): FinalActionTicket {
    return {
      deviceId: this.deviceId,
      sessionId: this.sessionId,
      createdAt: this.createdAt,
      userId: this.userId,
      pageType: this.pageType,
      pageUrl: this.pageUrl,
      actionType: this.actionType,
      actionTag: this.actionTag,
      actionArea: this.actionArea,
      actionLabel: this.actionLabel,
      expName: this.expName,
      expUser: this.expUser,
      referral: EnvChecker.isProdBrowser() ? document.referrer : "",
      clientVersion:
        EnvChecker.isProdBrowser() && (window as any)._script_version_
          ? (window as any)._script_version_.version
          : null,
    };
  }

  public increaseErrorCount() {
    this._errorCount += 1;
  }

  get errorCount() {
    return this._errorCount;
  }
}
