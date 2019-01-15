import * as store from "store";
import * as format from "date-fns/format";
import { DEVICE_ID_KEY, SESSION_ID_KEY, USER_ID_KEY } from ".";
import EnvChecker from "../envChecker";

export type ActionTagType =
  | "pageView"
  | "authorShow"
  | "paperShow"
  | "refList"
  | "citedList"
  | "journalShow"
  | "query"
  | "downloadPdf"
  | "source"
  | "addToCollection"
  | "removeFromCollection"
  | "citePaper"
  | "signUp"
  | "signIn"
  | "fos"
  | "copyDoi"
  | "signInViaCollection"
  | "blogPost"
  | "journalHomepage"
  | "queryInJournal"
  | "";

export type PageType =
  | "paperShow"
  | "authorShow"
  | "home"
  | "searchResult"
  | "journalShow"
  | "collectionShow"
  | "collectionList"
  | "signIn"
  | "signUp"
  | "resetPassword"
  | "emailVerification"
  | "terms"
  | "unknown";

export type ActionArea =
  | "topBar"
  | "refList"
  | "citedList"
  | "paperList"
  | "paperDescription"
  | "otherPaperList"
  | "relatedPaperList"
  | "fosSuggestion"
  | "ourStory"
  | "coAuthor"
  | "topFos"
  | "authorDialog"
  | "allPublications";

export interface ActionTicketParams {
  pageType: PageType;
  actionArea: ActionArea | PageType | null;
  actionType: "fire" | "view";
  actionTag: ActionTagType;
  actionLabel: string | number | null;
}

export interface FinalActionTicket extends ActionTicketParams {
  pageUrl: string;
  pageType: PageType;
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
  private actionType: "fire" | "view";
  private actionTag: ActionTagType;
  private actionArea: ActionArea | PageType | null;
  private pageType: PageType;
  private actionLabel: string | number | null;
  private _errorCount = 0;

  public constructor(params: ActionTicketParams) {
    if (!EnvChecker.isOnServer()) {
      this.pageUrl = window.location.href;
      this.actionType = params.actionType;
      this.actionTag = params.actionTag;
      this.actionArea = params.actionArea;
      this.pageType = params.pageType;
      this.actionLabel = params.actionLabel;
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
    };
  }

  public increaseErrorCount() {
    this._errorCount += 1;
  }

  get errorCount() {
    return this._errorCount;
  }
}
