import { checkBenefitExp } from "../checkBenefitExpCount";

export async function getBlockedValueForQueryLoverTest(
  userGroupName: string,
  actionArea: Scinapse.ActionTicket.ActionArea
) {
  let blockedCount: number | null = null;

  switch (userGroupName) {
    case "control":
      blockedCount = null;
      break;
    case "2":
      blockedCount = 2;
      break;
    case "3":
      blockedCount = 3;
      break;
    case "4":
      blockedCount = 4;
      break;
    case "6":
      blockedCount = 6;
      break;
    default:
      blockedCount = null;
      break;
  }

  if (blockedCount) {
    return checkBenefitExp({
      type: "queryLover",
      matching: "session",
      maxCount: blockedCount,
      actionArea,
      userActionType: "queryLover",
      expName: "queryLover",
    });
  }
}
