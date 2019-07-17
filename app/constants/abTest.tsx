import { broadAuthorVenue, knowledgeBasedRecommend, sourceDomain, dummy, autoYearFilter, figure } from './abTestObject';

export interface UserGroup {
  groupName: string;
  weight: number;
}

export interface Test {
  name: ABTest;
  userGroup: UserGroup[];
}

export type SignUpConversion = 'queryLover' | 'downloadCount';

export type ABTest =
  | 'broadAuthorVenue'
  | 'sourceDomain'
  | 'knowledgeBasedRecommend'
  | 'dummy'
  | 'autoYearFilter'
  | 'figure';

export const SIGN_UP_CONVERSION_KEY = 'b_exp';

export type SignUpConversionObject = { [key in SignUpConversion]: SignUpConversionExp };

export interface SignUpConversionExp {
  sessionId: string;
  deviceId: string;
  shouldAvoidBlock: boolean;
  count: number;
}

export interface SignUpConversionExpTicketContext {
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType | null;
  actionLabel: string | null;
  expName?: string;
}

export const LIVE_TESTS: Test[] = [
  broadAuthorVenue,
  knowledgeBasedRecommend,
  sourceDomain,
  dummy,
  autoYearFilter,
  figure,
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
