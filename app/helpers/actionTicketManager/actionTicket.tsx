import * as store from "store";
import * as format from "date-fns/format";
import { USER_ID_KEY } from "../../middlewares/trackUser";
import { DEVICE_ID_KEY, SESSION_ID_KEY } from ".";

export type ActionTagType =
  | "page_view" // page impression
  | "author_show" // Move to author show page
  | "paper_show" // Move to paper show page
  | "journal_show" // Move to journal show page
  | "query"; // search the results

type PageType =
  | "paper_show"
  | "author_show"
  | "home"
  | "search_result"
  | "journal_show"
  | "collection_show"
  | "collection_list"
  | "terms";

type ActionArea = "paper_show" | "navbar";

export type Ticket = FinalActionTicket & ActionTicketMeta;

interface ActionTicketMeta {
  errorCount?: number;
}

export interface ActionTicketParams {
  pageType: PageType;
  pageUrl: string;
  actionArea: ActionArea | null;
  actionTarget: string | null;
  actionType: "fire" | "view";
  actionTag: ActionTagType;
  actionLabel: string | null;
}

export interface FinalActionTicket extends ActionTicketParams {
  deviceId: string;
  sessionId: string;
  createdAt: string;
  userId: string | null;
}

export default class ActionTicket {
  private deviceId = store.get(DEVICE_ID_KEY);
  private sessionId = store.get(SESSION_ID_KEY);
  private userId = store.get(USER_ID_KEY) || null;
  private createdAt = format(new Date());
  private pageUrl: string;
  private actionTarget: string | null;
  private actionType: "fire" | "view";
  private actionTag: ActionTagType;
  private actionArea: ActionArea | null;
  private pageType: PageType;
  private actionLabel: string | null;
  private _errorCount = 0;

  public constructor(params: ActionTicketParams) {
    this.pageUrl = params.pageUrl;
    this.actionTarget = params.actionTarget;
    this.actionType = params.actionType;
    this.actionTag = params.actionTag;
    this.actionArea = params.actionArea;
    this.pageType = params.pageType;
    this.actionLabel = params.actionLabel;
  }

  public getTicketWithoutMeta(): FinalActionTicket {
    return {
      deviceId: this.deviceId,
      sessionId: this.sessionId,
      createdAt: this.createdAt,
      userId: this.userId,
      pageType: this.pageType,
      pageUrl: this.pageUrl,
      actionTarget: this.actionTarget,
      actionType: this.actionType,
      actionTag: this.actionTag,
      actionArea: this.actionArea,
      actionLabel: this.actionLabel,
    };
  }

  public increaseErrorCount() {
    this._errorCount += 1;
  }

  get errorCount() {
    return this._errorCount;
  }
}
