import { checkBenefitExp } from "./checkBenefitExpCount";
4;
export async function shouldBlockToSignUp(actionArea: Scinapse.ActionTicket.ActionArea, actionLabel: string) {
  return await checkBenefitExp({
    type: "downloadCount",
    matching: "session",
    maxCount: 3,
    actionArea,
    userActionType: "paperShow",
    expName: "downloadCount",
    actionLabel,
  });
}
