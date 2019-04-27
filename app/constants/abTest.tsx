import { signUpContextTest, paperFromSearchTest, queryLoverTest, completeBlockSignUpTest } from "./abTestObject";

export interface UserGroup {
  groupName: string;
  weight: number;
}

export interface Test {
  name: ABTestType;
  userGroup: UserGroup[];
}

export type BenefitExpType = "queryCountSession" | "refPaperCountSession" | "paperviewCountDevice" | "downloadCount";

export type ABTestType =
  | "paperFromSearch"
  | "queryLover"
  | "authorFromSearch"
  | "nextPageFromSearch"
  | "signUpContextText"
  | "completeBlockSignUp";

export const BENEFIT_EXPERIMENT_KEY = "b_exp";

export type BenefitExpValue = { [key in ABTestType | BenefitExpType]: BenefitExp };

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

export const LIVE_TESTS: Test[] = [signUpContextTest, paperFromSearchTest, queryLoverTest, completeBlockSignUpTest];

function getRandomPool(): { [key: string]: string[] } {
  const randomPool: { [key: string]: string[] } = {};
  LIVE_TESTS.forEach(test => {
    test.userGroup.forEach(group => {
      const groupRandomPool: string[] = [];
      for (let i = 0; i < group.weight; i++) {
        groupRandomPool.push(group.groupName);
      }
      randomPool[test.name] = groupRandomPool;
    });
  });
  return randomPool;
}

const RANDOM_POOL = getRandomPool();

export function getRandomUserGroup(testName: string): string {
  const groupRandomPool = RANDOM_POOL[testName];
  return groupRandomPool[Math.floor(Math.random() * groupRandomPool.length)];
}
