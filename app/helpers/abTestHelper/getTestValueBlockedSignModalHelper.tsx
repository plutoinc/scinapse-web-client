import { COMPLETE_BLOCK_SIGN_UP_BINARY_TEST_NAME } from "../../constants/abTestGlobalValue";
import { getUserGroupName } from ".";

export function getBlockedValueForCompleteBlockSignUpTest() {
  const userGroupName = getUserGroupName(COMPLETE_BLOCK_SIGN_UP_BINARY_TEST_NAME);
  switch (userGroupName) {
    case "strongBlock":
      return true;
    case "weakBlock":
      return false;
    default:
      return true;
  }
}
