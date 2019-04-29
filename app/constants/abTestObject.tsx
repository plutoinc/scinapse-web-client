import { Test } from "./abTest";

export const signUpContextTest: Test = {
  name: "signUpContextText",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "positive", weight: 1 }],
};

export const paperFromSearchTest: Test = {
  name: "paperFromSearch",
  userGroup: [
    { groupName: "control", weight: 1 },
    { groupName: "3", weight: 2 },
    { groupName: "5", weight: 2 },
    { groupName: "7", weight: 2 },
  ],
};

export const queryLoverTest: Test = {
  name: "queryLover",
  userGroup: [
    { groupName: "control", weight: 1 },
    { groupName: "4", weight: 2 },
    { groupName: "6", weight: 2 },
    { groupName: "8", weight: 2 },
  ],
};

export const completeBlockSignUpTest: Test = {
  name: "completeBlockSignUp",
  userGroup: [
    { groupName: "control", weight: 4 },
    { groupName: "blackLayer", weight: 2 },
    { groupName: "closeIconTop", weight: 1 },
    { groupName: "closeIconBottom", weight: 1 },
  ],
};
