import { dummy, weightedCitation, strictSort, randomRec, emailRecommendPaperSignUpBanner } from './abTestObject';

export interface UserGroup {
  groupName: string;
  weight: number;
}

export interface Test {
  name: ABTest;
  userGroup: UserGroup[];
}

export type ABTest = 'dummy' | 'weightedCitation' | 'strictSort' | 'randomRec' | 'emailRecommend';

export interface SignUpConversionExpTicketContext {
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType | null;
  actionLabel: string | null;
  expName?: string;
}

export const LIVE_TESTS: Test[] = [dummy, weightedCitation, strictSort, randomRec, emailRecommendPaperSignUpBanner];

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
