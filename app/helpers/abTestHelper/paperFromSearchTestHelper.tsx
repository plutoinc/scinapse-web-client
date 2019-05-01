import { checkBenefitExp } from "../checkBenefitExpCount";

export async function getBlockedValueForPaperFromSearchTest(
  userGroupName: string,
  actionArea: Scinapse.ActionTicket.ActionArea
) {
  let blockedCount: number | null;

  switch (userGroupName) {
    case "control":
      blockedCount = null;
      break;
    case "3":
      blockedCount = 3;
      break;
    case "5":
      blockedCount = 5;
      break;
    case "7":
      blockedCount = 7;
      break;
    default:
      blockedCount = null;
      break;
  }

  if (blockedCount) {
    return checkBenefitExp({
      type: "paperFromSearch",
      matching: "device",
      maxCount: blockedCount,
      actionArea,
      userActionType: "paperFromSearch",
      expName: "paperFromSearch",
    });
  } else {
    return false;
  }
}
