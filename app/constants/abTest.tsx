interface UserGroup {
  groupName: string;
  weight: number;
}

interface Test {
  name: string;
  userGroup: UserGroup[];
}

export type BenefitExpType =
  | "queryCountSession"
  | "refPaperCountSession"
  | "getFromFirstResultPage"
  | "paperviewCountDevice"
  | "downloadCount";

export const BENEFIT_EXPERIMENT_KEY = "b_exp";

export type BenefitExpValue = { [key in BenefitExpType]: BenefitExp };

export interface BenefitExp {
  sessionId: string;
  deviceId: string;
  shouldAvoidBlock: boolean;
  count: number;
}

export interface BenefitExpTicketContext {
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType | null;
  actionLabel: string | null;
  expName?: string;
}

export const LIVE_TESTS: Test[] = [];
