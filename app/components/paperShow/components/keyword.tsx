import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Fos, NewFOS } from '../../../model/fos';
import SearchQueryManager from '../../../helpers/searchQueryManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { Button } from '@pluto_network/pluto-design-elements';
import { createKeywordAlert, deleteKeywordAlert } from '../../../containers/keywordSettings/actions';
import { AppState } from '../../../reducers';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import { KeywordSettingItemResponse } from '../../../api/types/member';
import GroupButton from '../../common/groupButton';
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

const getTargetKeyword = (keyword: string) =>
  createSelector([(state: AppState) => state.keywordSettingsState], keywordSettingsState => {
    return keywordSettingsState.keywords.filter(k => k.keyword === keyword)[0];
  });

const PaperShowKeyword: React.FC<PaperShowKeywordProps> = ({ fos, pageType, actionArea }) => {
  useStyles(s);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

  const keyword = getFosKeyword(fos);
  const targetKeyword = useSelector<AppState, KeywordSettingItemResponse>(getTargetKeyword(keyword));

  async function onClickAlertButton() {
    setIsLoading(true);

    const isBlocked = await blockUnverifiedUser({
      authLevel: AUTH_LEVEL.UNVERIFIED,
      actionArea: actionArea!,
      actionLabel: 'clickCreateAlertBtn',
      userActionType: 'clickCreateAlertBtn',
    });

    if (isBlocked) return setIsLoading(false);

    try {
      if (!targetKeyword) {
        await dispatch(createKeywordAlert(keyword, actionArea));
      } else {
        await dispatch(deleteKeywordAlert(targetKeyword.id, targetKeyword.keyword));
      }
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  }

  return (
    <GroupButton variant="contained" color="black" className={s.fosBtnWrapper}>
      <Button
        elementType="link"
        to={formattedFOSLocation(keyword)}
        size="small"
        variant="contained"
        color="black"
        style={{
          color: '#7e8698',
          padding: '8px 12px',
        }}
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
        isLoading={isLoading}
        style={{ color: '#7e8698', padding: '8px' }}
        onClick={onClickAlertButton}
      >
        {!targetKeyword ? (
          <Icon icon="ALERT_LINE" className={s.alertIcon} />
        ) : (
          <Icon icon="ALERT" className={s.alertIcon} />
        )}
      </Button>
    </GroupButton>
  );
};

export default PaperShowKeyword;
