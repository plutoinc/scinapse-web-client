import * as store from "store";
import { BenefitExpValue, BENEFIT_EXPERIMENT_KEY, ABTestType, BenefitExpType } from "../constants/abTest";
import { SESSION_ID_KEY, DEVICE_ID_KEY } from "../constants/actionTicket";
import { blockUnverifiedUser, AUTH_LEVEL } from "./checkAuthDialog";
import { COMPLETE_BLOCK_SIGN_UP_TEST_USER_GROUP } from "../constants/abTestGlobalValue";

interface CheckBenefitExpCount {
  type: ABTestType | BenefitExpType;
  maxCount: number;
  matching: "session" | "device";
  userActionType: Scinapse.ActionTicket.ActionTagType;
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType;
  expName: ABTestType | BenefitExpType;
  actionLabel?: string;
}

function getBlockedValueForCompleteBlockSignUpTest() {
  switch (COMPLETE_BLOCK_SIGN_UP_TEST_USER_GROUP) {
    case "control":
    case "closeIconTop":
    case "closeIconBottom":
      return true;
    case "blackLayer":
      return false;
    default:
      return true;
  }
}

export async function checkBenefitExp({
  type,
  maxCount,
  matching,
  userActionType,
  actionArea,
  expName,
}: CheckBenefitExpCount): Promise<boolean> {
  const exp: BenefitExpValue | undefined = store.get(BENEFIT_EXPERIMENT_KEY);
  const currentSessionId = store.get(SESSION_ID_KEY);
  const currentDeviceId = store.get(DEVICE_ID_KEY);

  if (
    exp &&
    exp[type] &&
    ((matching === "session" && exp[type].sessionId === currentSessionId) ||
      (matching === "device" && exp[type].deviceId === currentDeviceId))
  ) {
    const nextCount = exp[type].count + 1;
    const shouldBlock = nextCount >= maxCount;
    const newExp = {
      ...exp,
      [type]: {
        sessionId: currentSessionId,
        deviceId: currentDeviceId,
        count: nextCount,
        shouldAvoidBlock: shouldBlock,
      },
    };

    if (shouldBlock) {
      store.set(BENEFIT_EXPERIMENT_KEY, newExp);
      return await blockUnverifiedUser({
        authLevel: AUTH_LEVEL.VERIFIED,
        userActionType,
        actionArea,
        actionLabel: expName,
        expName,
        isBlocked: getBlockedValueForCompleteBlockSignUpTest(),
      });
    } else {
      store.set(BENEFIT_EXPERIMENT_KEY, newExp);
      return false;
    }
  } else {
    const newExp = {
      ...exp,
      [type]: {
        sessionId: currentSessionId,
        deviceId: currentDeviceId,
        count: 1,
        shouldAvoidBlock: false,
      },
    };
    store.set(BENEFIT_EXPERIMENT_KEY, newExp);
    return false;
  }
}
