interface UserGroup {
  groupName: string;
  weight: number;
}

interface Test {
  name: string;
  userGroup: UserGroup[];
}

type BenefitExpType =
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
  count: number;
}

export const LIVE_TESTS: Test[] = [];
