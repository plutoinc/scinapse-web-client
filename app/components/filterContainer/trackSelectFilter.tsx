import { FILTER_BOX_TYPE } from "../../constants/paperSearch";
import { trackEvent } from "../../helpers/handleGA";
import ActionTicketManager from "../../helpers/actionTicketManager";

export function trackSelectFilter(actionType: FILTER_BOX_TYPE, actionValue: string | number) {
  trackEvent({ category: "Filter", action: actionType, label: String(actionValue) });
  ActionTicketManager.trackTicket({
    pageType: "searchResult",
    actionType: "fire",
    actionArea: "filter",
    actionTag: actionType,
    actionLabel: String(actionValue),
  });
}
