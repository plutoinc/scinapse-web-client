import * as store from "store";
import { SESSION_COUNT_KEY } from "../../constants/actionTicket";
import { ABTestType, BENEFIT_EXPERIMENT_KEY, BenefitExpValue } from "../../constants/abTest";
import { checkBenefitExp } from "../checkBenefitExpCount";

export async function getBlockedValueForQueryLoverTest(
  userGroupName: string,
  actionArea: Scinapse.ActionTicket.ActionArea
) {
  let blockedCount: number | null = null;
  const currentSessionCount = store.get(SESSION_COUNT_KEY);
  let currentSearchCount: number = 0;
  const exp: BenefitExpValue = store.get(BENEFIT_EXPERIMENT_KEY);

  if (exp && exp["queryLover" as ABTestType]) {
    currentSearchCount = exp["queryLover" as ABTestType].count;
  }

  const queryLoverCount = currentSearchCount * currentSessionCount;

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

  if (blockedCount && (queryLoverCount < blockedCount || queryLoverCount >= blockedCount)) {
    return checkBenefitExp({
      type: "queryLover",
      matching: "session",
      maxCount: blockedCount,
      actionArea,
      userActionType: "queryLover",
      expName: "queryLover",
    });
  } else {
    return false;
  }
}
