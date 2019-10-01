import { Test } from './abTest';
import {
  DUMMY_TEST,
  WEIGHTED_CITATION_EXPERIMENT,
  EMAIL_RECOMMEND_PAPER_SIGN_UP_BANNER,
  AUTH_METHOD_EXPERIMENT,
  COLLECTION_BUTTON_TEXT_EXPERIMENT,
  REQUEST_FULL_TEXT_DIALOG_EXPERIMENT,
} from './abTestGlobalValue';

export const enum EmailRecommendPaperSignUpBannerTestType {
  CONTROL = 'control',
  LETTERS = 'letters',
  TIRED = 'tired',
  WANDERING = 'wandering',
}

export const enum AuthMethodTestType {
  CONTROL = 'control',
  ORCID_TOP = 'orcid_top',
  NO_FACEBOOK = 'noFacebook',
  NO_GOOGLE = 'noGoogle',
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

export type WeightedCitationUserGroup = 'a' | 'b' | 'c' | 'd';

export const enum requestFullTextDialogExperimentType {
  CONTROL = 'control',
  DETAIL = 'detailed_message',
}

export const weightedCitation: Test<WeightedCitationUserGroup> = {
  name: WEIGHTED_CITATION_EXPERIMENT,
  userGroup: [
    { groupName: 'a', weight: 1 },
    { groupName: 'b', weight: 1 },
    { groupName: 'c', weight: 1 },
    { groupName: 'd', weight: 1 },
  ],
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

export const authMethod: Test = {
  name: AUTH_METHOD_EXPERIMENT,
  userGroup: [
    { groupName: AuthMethodTestType.CONTROL, weight: 1 },
    { groupName: AuthMethodTestType.ORCID_TOP, weight: 3 },
    { groupName: AuthMethodTestType.NO_FACEBOOK, weight: 1 },
    { groupName: AuthMethodTestType.NO_GOOGLE, weight: 1 },
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

export const requestFullTextDialogExperiment: Test = {
  name: REQUEST_FULL_TEXT_DIALOG_EXPERIMENT,
  userGroup: [
    { groupName: requestFullTextDialogExperimentType.CONTROL, weight: 1 },
    { groupName: requestFullTextDialogExperimentType.DETAIL, weight: 2 },
  ],
};
