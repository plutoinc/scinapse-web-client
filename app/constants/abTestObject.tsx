import { Test } from "./abTest";

export const scinapseLogoTest: Test = {
  name: "scinapseLogo",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "searchEngine", weight: 1 }],
};

export const bannerTest: Test = {
  name: "signBannerAtSearch-banner",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "banner", weight: 2 }],
};

export const bannerCuratedTest: Test = {
  name: "signBannerAtSearch-curated",
  userGroup: [
    { groupName: "areyouresearcher-yesofcourse", weight: 1 },
    { groupName: "bemember-joinnow", weight: 1 },
    { groupName: "areyouresearcher-signup", weight: 1 },
  ],
};

export const signBannerAtPaperShowTest: Test = {
  name: "signBannerAtPaperShow-banner",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "banner", weight: 2 }],
};

export const signBannerAtPaperShowTitleTextTest: Test = {
  name: "signBannerAtPaperShow-titleText",
  userGroup: [
    { groupName: "onlymember", weight: 1 },
    { groupName: "youcanmore", weight: 1 },
    { groupName: "enjoyeverything", weight: 1 },
  ],
};

export const signBannerAtPaperShowTitleTextKeyverbTest: Test = {
  name: "signBannerAtPaperShow-titleText-keyverb",
  userGroup: [{ groupName: "enjoy", weight: 1 }, { groupName: "browse", weight: 1 }],
};

export const relatedPapersAtPaperShowTest: Test = {
  name: "relatedPapersAtPaperShow",
  userGroup: [
    { groupName: "control", weight: 1 },
    { groupName: "related", weight: 1 },
    { groupName: "relatedAndSearch", weight: 1 },
    { groupName: "search", weight: 1 },
  ],
};
