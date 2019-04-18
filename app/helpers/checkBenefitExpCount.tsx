import * as store from "store";
import { BenefitExpType, BenefitExpValue, BENEFIT_EXPERIMENT_KEY } from "../constants/abTest";
import { SESSION_ID_KEY, DEVICE_ID_KEY } from "../constants/actionTicket";
import { blockUnverifiedUser, AUTH_LEVEL } from "./checkAuthDialog";

interface CheckBenefitExpCount {
  type: BenefitExpType;
  maxCount: number;
  matching: "session" | "device";
  userActionType: Scinapse.ActionTicket.ActionTagType;
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType;
  expName: BenefitExpType;
  actionLabel?: string;
}

export async function checkBenefitExp({
  type,
  maxCount,
  matching,
  userActionType,
  actionArea,
  actionLabel,
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
    const shouldBlock = nextCount >= maxCount && !exp[type].shouldAvoidBlock;
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
        actionLabel: actionLabel || String(exp[type].count),
        expName,
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
