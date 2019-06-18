import { Test } from './abTest';
import {
  SEARCH_ENGINE_MOOD_TEST,
  SIGN_BANNER_AT_PAPER_SHOW_TEST,
  SEARCH_ITEM_IMPROVEMENT_TEST,
} from './abTestGlobalValue';

export const searchEngineMoodTest: Test = {
  name: SEARCH_ENGINE_MOOD_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'searchEngine', weight: 1 }],
};

export const signBannerAtPaperShowTest: Test = {
  name: SIGN_BANNER_AT_PAPER_SHOW_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'bottomBanner', weight: 1 }],
};

export const searchItemImprovement: Test = {
  name: SEARCH_ITEM_IMPROVEMENT_TEST,
  userGroup: [
    { groupName: 'control', weight: 1 },
    { groupName: 'visitHistory', weight: 1 },
    { groupName: 'notIncludedWords', weight: 1 },
  ],
};
