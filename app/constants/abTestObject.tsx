import { Test } from './abTest';

export const searchEngineMoodTest: Test = {
  name: 'searchEngineMood',
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'searchEngine', weight: 1 }],
};

export const bannerCuratedTest: Test = {
  name: 'signBannerAtSearch-curated',
  userGroup: [
    { groupName: 'areyouresearcher-yesofcourse', weight: 1 },
    { groupName: 'bemember-joinnow', weight: 1 },
    { groupName: 'areyouresearcher-signup', weight: 1 },
  ],
};

export const relatedPapersAtPaperShowTest: Test = {
  name: 'relatedPapersAtPaperShow',
  userGroup: [
    { groupName: 'control', weight: 1 },
    { groupName: 'related', weight: 1 },
    { groupName: 'relatedAndSearch', weight: 1 },
    { groupName: 'search', weight: 1 },
  ],
};

export const signBannerAtPaperShowTest: Test = {
  name: 'signBannerAtPaperShow',
  userGroup: [
    { groupName: 'control', weight: 1 },
    { groupName: 'bottomBanner', weight: 2 },
    { groupName: 'suddenAlert', weight: 2 },
    { groupName: 'searchBanner', weight: 2 },
  ],
};

export const fullTextBlurredTest: Test = {
  name: 'fullTextBlurred',
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'contexthighlight', weight: 2 }],
};

export const refCitedChildPaperList: Test = {
  name: 'refCitedPaperItem',
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'refCitedPaperItem', weight: 1 }],
};

export const queryLoverBoundaryTest: Test = {
  name: 'queryLover-boundaryTest',
  userGroup: [{ groupName: 'queryPerDevice', weight: 1 }, { groupName: 'queryPerSession', weight: 1 }],
};
