import { Test } from './abTest';
import {
  DUMMY_TEST,
  WEIGHTED_CITATION_EXPERIMENT,
  STRICT_SORT_EXPERIMENT,
  EMAIL_RECOMMEND_PAPER_SIGN_UP_BANNER,
} from './abTestGlobalValue';

export const enum EmailRecommendPaperSignUpBannerTestType {
  RECOMMEND = 'recommend',
  TIRED = 'tired',
  WONDER = 'wonder',
}

export const dummy: Test = {
  name: DUMMY_TEST,
  userGroup: [{ groupName: 'a', weight: 1 }, { groupName: 'b', weight: 1 }],
};

export const weightedCitation: Test = {
  name: WEIGHTED_CITATION_EXPERIMENT,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'wc', weight: 3 }],
};

export const strictSort: Test = {
  name: STRICT_SORT_EXPERIMENT,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'ss', weight: 3 }],
};

export const emailRecommendPaperSignUpBanner: Test = {
  name: EMAIL_RECOMMEND_PAPER_SIGN_UP_BANNER,
  userGroup: [
    { groupName: EmailRecommendPaperSignUpBannerTestType.RECOMMEND, weight: 1 },
    { groupName: EmailRecommendPaperSignUpBannerTestType.TIRED, weight: 1 },
    { groupName: EmailRecommendPaperSignUpBannerTestType.WONDER, weight: 1 },
  ],
};
