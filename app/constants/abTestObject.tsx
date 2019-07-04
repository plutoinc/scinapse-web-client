import { Test } from './abTest';
import {
  SEARCH_ITEM_IMPROVEMENT_TEST,
  GURU_AT_SEARCH_TEST,
  KNOWLEDGE_BASED_RECOMMEND_TEST,
  DUMMY_TEST,
} from './abTestGlobalValue';

export const searchItemImprovement: Test = {
  name: SEARCH_ITEM_IMPROVEMENT_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'broadAuthorVenue', weight: 1 }],
};

export const guruAtSearch: Test = {
  name: GURU_AT_SEARCH_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'guru', weight: 4 }],
};

export const knowledgeBasedRecommend: Test = {
  name: KNOWLEDGE_BASED_RECOMMEND_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'knowledgeBasedRecommend', weight: 1 }],
};

export const dummy: Test = {
  name: DUMMY_TEST,
  userGroup: [{ groupName: 'a', weight: 1 }, { groupName: 'b', weight: 1 }],
};
