import { checkBenefitExp } from './checkBenefitExpCount';

export async function shouldBlockToSignUp(actionArea: Scinapse.ActionTicket.ActionArea, actionLabel: string) {
  return await checkBenefitExp({
    type: 'downloadCount',
    matching: 'session',
    maxCount: 0,
    actionArea,
    userActionType: 'paperShow',
    expName: 'downloadCount',
    actionLabel,
  });
}
