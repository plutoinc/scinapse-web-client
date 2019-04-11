import * as Cookies from "js-cookie";
import * as store from "store";
import { benefitSignUpTest, BENEFIT_EXPERIMENT_KEY, BenefitExp } from "../constants/abTest";
import { SESSION_ID_KEY } from "../constants/actionTicket";
import { checkAuth, AUTH_LEVEL } from "./checkAuthDialog";

export function shouldBlockToSignUp(actionArea: Scinapse.ActionTicket.ActionArea, actionLabel: string) {
  if (Cookies.get(benefitSignUpTest.name) === "downloadCount") {
    const currentSessionId = store.get(SESSION_ID_KEY);
    const exp: BenefitExp | undefined = store.get(BENEFIT_EXPERIMENT_KEY);

    if (!exp || exp.id !== currentSessionId) {
      store.set(BENEFIT_EXPERIMENT_KEY, {
        id: currentSessionId,
        count: 1,
      } as BenefitExp);
    } else {
      const nextCount = exp.count + 1;
      store.set(BENEFIT_EXPERIMENT_KEY, {
        id: currentSessionId,
        count: nextCount,
      } as BenefitExp);
      if (nextCount > 3) {
        store.set(BENEFIT_EXPERIMENT_KEY, {
          id: currentSessionId,
          count: 2,
        } as BenefitExp);

        const isVerified = checkAuth({
          authLevel: AUTH_LEVEL.VERIFIED,
          userActionType: "downloadPdf",
          actionArea,
          actionLabel,
        });
        return !isVerified;
      }
    }
  }
}
