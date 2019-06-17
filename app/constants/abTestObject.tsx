import { Test } from './abTest';

export const searchEngineMoodTest: Test = {
  name: 'searchEngineMood',
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'searchEngine', weight: 1 }],
};

export const signBannerAtPaperShowTest: Test = {
  name: 'signBannerAtPaperShow',
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'bottomBanner', weight: 1 }],
};

export const searchItemImprovement: Test = {
  name: 'searchItemImprovement',
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'visitHistory', weight: 1 }],
};
