import { checkBenefitExp } from "./checkBenefitExpCount";

export function shouldBlockToSignUp(actionArea: Scinapse.ActionTicket.ActionArea, actionLabel: string) {
  return checkBenefitExp({
    type: "downloadCount",
    matching: "session",
    maxCount: 3,
    actionArea,
    userActionType: "paperShow",
    expName: "downloadCount",
    actionLabel,
  });
}
