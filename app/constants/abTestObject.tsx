import { Test } from "./abTest";

export const bannerTest: Test = {
  name: "signBannerAtSearch-banner",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "banner", weight: 2 }],
};

export const signButtonTextTest: Test = {
  name: "signBannerAtSearch-signButtonText",
  userGroup: [
    { groupName: "joinnow", weight: 1 },
    { groupName: "registernow", weight: 1 },
    { groupName: "signup", weight: 1 },
    { groupName: "yesofcourse", weight: 1 },
  ],
};

export const bodyTextTest: Test = {
  name: "signBannerAtSearch-bodyText",
  userGroup: [{ groupName: "a", weight: 1 }, { groupName: "b", weight: 1 }, { groupName: "c", weight: 1 }],
};

export const titleTextTest: Test = {
  name: "signBannerAtSearch-titleText",
  userGroup: [
    { groupName: "unlimited", weight: 1 },
    { groupName: "areyouresearcher", weight: 1 },
    { groupName: "bemember", weight: 1 },
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
