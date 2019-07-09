import { FILTER_BOX_TYPE } from '../constants/paperSearch';
import { trackEvent } from './handleGA';
import ActionTicketManager from './actionTicketManager';

export function trackSelectFilter(actionType: FILTER_BOX_TYPE, actionValue: string | number) {
  trackEvent({ category: 'Filter', action: actionType, label: String(actionValue) });
  ActionTicketManager.trackTicket({
    pageType: 'searchResult',
    actionType: 'fire',
    actionArea: 'filter',
    actionTag: actionType,
    actionLabel: String(actionValue),
  });
}
