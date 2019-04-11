interface UserGroup {
  groupName: string;
  weight: number;
}

interface Test {
  name: string;
  userGroup: UserGroup[];
}

export const benefitTestUserGroup = [
  { groupName: "queryCountSession", weight: 0.1224 },
  { groupName: "refPaperCountSession", weight: 0.3673 },
  { groupName: "getFromFirstResultPage", weight: 0.1837 },
  { groupName: "paperviewCountDevice", weight: 0.0735 },
  { groupName: "downloadCount", weight: 0.0864 },
  { groupName: "control", weight: 0.1667 },
];

export const benefitSignUpTest = {
  name: "benefitSignupConversion",
  userGroup: benefitTestUserGroup,
};

export const BENEFIT_EXPERIMENT_KEY = "b_exp_key";

export interface BenefitExp {
  id: string;
  count: number;
}

export const LIVE_TESTS: Test[] = [benefitSignUpTest];
