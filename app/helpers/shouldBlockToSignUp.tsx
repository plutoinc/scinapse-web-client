import { checkBlockSignUpConversion } from './checkSignUpCount';

export async function shouldBlockToSignUp(actionArea: Scinapse.ActionTicket.ActionArea, actionLabel: string) {
  return await checkBlockSignUpConversion({
    type: 'downloadCount',
    matching: 'session',
    maxCount: 0,
    actionArea,
    userActionType: 'paperShow',
    expName: 'downloadCount',
    actionLabel,
  });
}
