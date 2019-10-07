import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Fos, NewFOS } from '../../../model/fos';
import SearchQueryManager from '../../../helpers/searchQueryManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import Button from '../../common/button';
import { createKeywordAlert, deleteKeywordAlert } from '../../../containers/keywordSettings/actions';
import { AppState } from '../../../reducers';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
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
  const { keywords, isLoading } = useSelector((appState: AppState) => ({
    keywords: appState.keywordSettingsState.keywords,
    isLoading: appState.keywordSettingsState.isLoading,
  }));

  const keyword = getFosKeyword(fos);
  const targetKeyword = keywords.filter(k => k.keyword === keyword)[0];

  const onClickAlertButton = useCallback(
    async () => {
      ActionTicketManager.trackTicket({
        pageType: pageType,
        actionType: 'fire',
        actionArea: actionArea || pageType,
        actionTag: 'clickCreateAlertBtn',
        actionLabel: String(fos.id),
      });

      const isBlocked = await blockUnverifiedUser({
        authLevel: AUTH_LEVEL.UNVERIFIED,
        actionArea: actionArea!,
        actionLabel: 'clickCreateAlertBtn',
        userActionType: 'clickCreateAlertBtn',
      });

      if (isBlocked) return;

      if (!targetKeyword) {
        dispatch(createKeywordAlert(keyword, actionArea));
      } else {
        dispatch(deleteKeywordAlert(targetKeyword.id, targetKeyword.keyword));
      }
    },
    [keyword, actionArea, targetKeyword, dispatch]
  );

  const buttonStyle: React.CSSProperties = {
    color: '#7e8698',
    padding: '8px 12px',
  };

  return (
    <div className={s.fosBtnWrapper}>
      <Button
        elementType="link"
        to={formattedFOSLocation(keyword)}
        size="small"
        variant="contained"
        color="black"
        style={{
          ...buttonStyle,
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
        size="small"
        variant="contained"
        color="black"
        fullWidth={false}
        disabled={false}
        isLoading={isLoading}
        style={{ ...buttonStyle, borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
        onClick={onClickAlertButton}
      >
        {!targetKeyword ? <Icon icon="ALERT_LINE" /> : <Icon icon="ALERT" />}
      </Button>
    </div>
  );
};

export default PaperShowKeyword;
