import * as React from 'react';
import { Fos, NewFOS } from '../../../model/fos';
import SearchQueryManager from '../../../helpers/searchQueryManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./keyword.scss');

interface PaperShowKeywordProps {
  fos: Fos | NewFOS;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

function isOldFos(fos: Fos | NewFOS): fos is Fos {
  return (fos as Fos).fos !== undefined;
}

function getFosKeyword(fos: Fos | NewFOS) {
  if (isOldFos(fos)) {
    return fos.fos;
  } else {
    return fos.name;
  }
}

function formattedFOSLocation(keyword: string) {
  const searchQuery = SearchQueryManager.stringifyPapersQuery({
    query: keyword || '',
    sort: 'RELEVANCE',
    page: 1,
    filter: {},
  });

  return `/search?${searchQuery}`;
}

const PaperShowKeyword: React.FC<PaperShowKeywordProps> = ({ fos, pageType, actionArea }) => {
  useStyles(s);

  const keyword = getFosKeyword(fos);

  return (
    <a
      href={formattedFOSLocation(keyword)}
      rel="noopener noreferrer"
      target="_blank"
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType: pageType,
          actionType: 'fire',
          actionArea: actionArea || pageType,
          actionTag: 'fos',
          actionLabel: String(fos.id),
        });
      }}
      className={s.buttonWrapper}
    >
      {keyword}
    </a>
  );
};

export default PaperShowKeyword;
