import { Test } from './abTest';
import {
  SIGN_BANNER_AT_PAPER_SHOW_TEST,
  SEARCH_ITEM_IMPROVEMENT_TEST,
  HOME_IMPROVEMENT_TEST,
  GURU_AT_SEARCH_TEST,
  KNOWLEDGE_BASED_RECOMMEND_TEST,
} from './abTestGlobalValue';

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
    { groupName: 'sourceDomain', weight: 1 },
    { groupName: 'broadAuthorVenue', weight: 1 },
  ],
};

export const homeImprovement: Test = {
  name: HOME_IMPROVEMENT_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'improvement', weight: 1 }],
};

export const guruAtSearch: Test = {
  name: GURU_AT_SEARCH_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'guru', weight: 4 }],
};

export const knowledgeBasedRecommend: Test = {
  name: KNOWLEDGE_BASED_RECOMMEND_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'knowledgeBasedRecommend', weight: 1 }],
};
