import ActionTicketManager from '../../../../../helpers/actionTicketManager';
import { IMPORT_SOURCE_TAB } from '../../../types';

type IMPORT_ACTION_TAG = 'clickSubmitGSBtn' | 'clickSubmitBibtexBtn' | 'clickSubmitCitationStringBtn' | 'clickSubmitAuthorUrlsBtn' | '';

interface Params {
  importSource: IMPORT_SOURCE_TAB;
  actionLabel: 'click' | 'success' | 'failed';
}

function trackImportAction({ importSource, actionLabel }: Params) {
  let actionTag: IMPORT_ACTION_TAG = '';
  switch (importSource) {
    case IMPORT_SOURCE_TAB.BIBTEX: actionTag = 'clickSubmitBibtexBtn';
      break;
    case IMPORT_SOURCE_TAB.GS: actionTag = 'clickSubmitGSBtn';
      break;
    case IMPORT_SOURCE_TAB.AUTHOR_URLS: actionTag = 'clickSubmitAuthorUrlsBtn';
      break;
    case IMPORT_SOURCE_TAB.CITATION: actionTag = 'clickSubmitCitationStringBtn';
      break;

    default:
      break;
  }

  ActionTicketManager.trackTicket({
    pageType: 'profileShow',
    actionType: 'fire',
    actionArea: importSource,
    actionTag: actionTag,
    actionLabel: actionLabel,
  });
}

export default trackImportAction;

