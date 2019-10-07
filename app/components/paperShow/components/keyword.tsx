import * as React from 'react';
import { Fos, NewFOS } from '../../../model/fos';
import SearchQueryManager from '../../../helpers/searchQueryManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import Button from '../../common/button';
import { useDispatch } from 'react-redux';
import { createKeywordAlert } from '../../../containers/keywordSettings/actions';
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
  const dispatch = useDispatch();

  const keyword = getFosKeyword(fos);

  return (
    <div className={s.fosBtnWrapper}>
      <Button
        elementType="link"
        to={formattedFOSLocation(keyword)}
        size="small"
        variant="contained"
        color="black"
        style={{
          color: '#7e8698',
          padding: '8px 12px',
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '0px',
          borderRight: '1px solid #bbc2d0',
        }}
        fullWidth={false}
        disabled={false}
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
      >
        {keyword}
      </Button>
      <Button
        elementType="button"
        size="medium"
        variant="contained"
        color="black"
        fullWidth={false}
        disabled={false}
        style={{ color: '#7e8698', padding: '8px 12px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
        onClick={() => dispatch(createKeywordAlert(keyword, actionArea))}
      >
        <Icon icon="ALERT_LINE" />
      </Button>
    </div>
  );
};

export default PaperShowKeyword;
