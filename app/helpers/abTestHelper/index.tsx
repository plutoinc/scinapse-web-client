import * as store from "store";
import * as Cookies from "js-cookie";
import { ABTestType, BenefitExpValue, BENEFIT_EXPERIMENT_KEY } from "../../constants/abTest";
import { checkBenefitExp } from "../checkBenefitExpCount";
import { SESSION_COUNT_KEY } from "../../constants/actionTicket";
import { controlSignUpContext, positiveSignUpContext } from "../../components/auth/authContextText/constants";
import { ContextText } from "../../components/auth/authContextText";

export function getUserGroupName(testName: ABTestType) {
  const getRandomUserName = Cookies.get(testName);
  return getRandomUserName;
}

export function getContextValueSignUpContextTest(
  userGroupName: string,
  userActionType: Scinapse.ActionTicket.ActionTagType
) {
  switch (userGroupName) {
    case "control":
      return <ContextText subText={controlSignUpContext[userActionType]} />;
    case "positive":
      return <ContextText subText={positiveSignUpContext[userActionType]} />;
    default:
      return null;
  }
}

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

export async function getBlockedValueForQueryLoverTest(
  userGroupName: string,
  actionArea: Scinapse.ActionTicket.ActionArea
) {
  let blockedCount: number | null = null;
  const currentSessionCount = store.get(SESSION_COUNT_KEY);
  let currentSearchCount: number = 0;
  const exp: BenefitExpValue = store.get(BENEFIT_EXPERIMENT_KEY);

  if (exp["queryLover" as ABTestType]) {
    currentSearchCount = exp["queryLover" as ABTestType].count;
  }

  const queryLoverCount = currentSearchCount * currentSessionCount;

  switch (userGroupName) {
    case "control":
      blockedCount = null;
      break;
    case "4":
      blockedCount = 4;
      break;
    case "6":
      blockedCount = 6;
      break;
    case "8":
      blockedCount = 8;
      break;
    default:
      blockedCount = null;
      break;
  }

  if (blockedCount && queryLoverCount <= blockedCount) {
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
