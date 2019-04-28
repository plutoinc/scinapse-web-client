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
    const testGroupWeightedPool: string[] = [];
    test.userGroup.forEach(group => {
      for (let i = 0; i < group.weight; i++) {
        testGroupWeightedPool.push(group.groupName);
      }
    });

    randomPool[test.name] = testGroupWeightedPool;
  });

  return randomPool;
}

const RANDOM_POOL = getRandomPool();

export function getRandomUserGroup(testName: string): string {
  console.log(RANDOM_POOL);
  const testGroupWeightedPool = RANDOM_POOL[testName];
  return testGroupWeightedPool[Math.floor(Math.random() * testGroupWeightedPool.length)];
}
