import * as store from 'store';
import { SIGN_UP_CONVERSION_KEY, SignUpConversion, SignUpConversionObject } from '../constants/abTest';
import { DEVICE_ID_KEY, SESSION_ID_KEY } from '../constants/actionTicket';
import { AUTH_LEVEL, blockUnverifiedUser } from './checkAuthDialog';
import { getUserGroupName } from './abTestHelper';
import { QUERY_LOVER_EXPERIMENT } from '../constants/abTestGlobalValue';

interface CheckBenefitExpCount {
  type: SignUpConversion;
  maxCount: number;
  matching: 'session' | 'device';
  userActionType: Scinapse.ActionTicket.ActionTagType;
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType;
  expName: SignUpConversion;
  actionLabel?: string;
}

export async function checkBlockSignUpConversion({
  type,
  maxCount,
  matching,
  userActionType,
  actionArea,
  expName,
}: CheckBenefitExpCount): Promise<boolean> {
  const exp: SignUpConversionObject | undefined = store.get(SIGN_UP_CONVERSION_KEY);
  const currentSessionId = store.get(SESSION_ID_KEY);
  const currentDeviceId = store.get(DEVICE_ID_KEY);
  const queryLoverUserGroup = getUserGroupName(QUERY_LOVER_EXPERIMENT);

  if (type === 'queryLover' && queryLoverUserGroup !== 'queryLover') return false;

  if (
    exp &&
    exp[type] &&
    ((matching === 'session' && exp[type].sessionId === currentSessionId) ||
      (matching === 'device' && exp[type].deviceId === currentDeviceId))
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
      store.set(SIGN_UP_CONVERSION_KEY, newExp);
      return await blockUnverifiedUser({
        authLevel: AUTH_LEVEL.VERIFIED,
        userActionType,
        actionArea,
        actionLabel: expName,
        expName,
        isBlocked: false,
      });
    } else {
      store.set(SIGN_UP_CONVERSION_KEY, newExp);
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
    store.set(SIGN_UP_CONVERSION_KEY, newExp);
    return false;
  }
}
