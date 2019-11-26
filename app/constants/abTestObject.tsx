import { Test } from './abTest';
import {
  DUMMY_TEST,
  EMAIL_RECOMMEND_PAPER_SIGN_UP_BANNER,
  COLLECTION_BUTTON_TEXT_EXPERIMENT,
} from './abTestGlobalValue';

export const enum EmailRecommendPaperSignUpBannerTestType {
  CONTROL = 'control',
  LETTERS = 'letters',
  TIRED = 'tired',
  WANDERING = 'wandering',
}

export const enum CollectionButtonTextTestType {
  CONTROL = 'control',
  ADD = 'add_to_collection',
  KEEP = 'keep',
  READ_LATER = 'read_later',
}

export const dummy: Test = {
  name: DUMMY_TEST,
  userGroup: [{ groupName: 'a', weight: 1 }, { groupName: 'b', weight: 1 }],
};

export const emailRecommendPaperSignUpBanner: Test = {
  name: EMAIL_RECOMMEND_PAPER_SIGN_UP_BANNER,
  userGroup: [
    { groupName: EmailRecommendPaperSignUpBannerTestType.CONTROL, weight: 1 },
    { groupName: EmailRecommendPaperSignUpBannerTestType.LETTERS, weight: 1 },
    { groupName: EmailRecommendPaperSignUpBannerTestType.TIRED, weight: 1 },
    { groupName: EmailRecommendPaperSignUpBannerTestType.WANDERING, weight: 1 },
  ],
};

export const collectionButtonText: Test = {
  name: COLLECTION_BUTTON_TEXT_EXPERIMENT,
  userGroup: [
    { groupName: CollectionButtonTextTestType.CONTROL, weight: 7 },
    { groupName: CollectionButtonTextTestType.ADD, weight: 1 },
    { groupName: CollectionButtonTextTestType.KEEP, weight: 1 },
    { groupName: CollectionButtonTextTestType.READ_LATER, weight: 1 },
  ],
};
