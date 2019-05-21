import {
  bannerTest,
  signBannerAtPaperShowTest,
  signBannerAtPaperShowTitleTextTest,
  signBannerAtPaperShowTitleTextKeyverbTest,
  searchEngineMoodTest,
  bannerCuratedTest,
} from "./abTestObject";

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
  | "queryLover"
  | "searchEngineMood"
  | "signBannerAtSearch-banner"
  | "signBannerAtSearch-curated"
  | "signBannerAtPaperShow-banner"
  | "signBannerAtPaperShow-titleText"
  | "signBannerAtPaperShow-titleText-keyverb";

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

export const LIVE_TESTS: Test[] = [
  searchEngineMoodTest,
  bannerTest,
  bannerCuratedTest,
  signBannerAtPaperShowTest,
  signBannerAtPaperShowTitleTextTest,
  signBannerAtPaperShowTitleTextKeyverbTest,
];

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
  const testGroupWeightedPool = RANDOM_POOL[testName];
  return testGroupWeightedPool[Math.floor(Math.random() * testGroupWeightedPool.length)];
}
