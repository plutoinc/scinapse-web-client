import React from 'react';
import { KeywordSettingItemResponse } from '../../api/types/member';
import Icon from '../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./keywordItemList.scss');

interface KeywordItemListProps {
  isLoggedIn: boolean;
  keywords: KeywordSettingItemResponse[];
  onRemoveKeywordItem: (keywordId: string, keyword: string) => void;
  isLoading: boolean;
}

const KeywordItemList: React.FC<KeywordItemListProps> = props => {
  useStyles(s);
  const { isLoggedIn, keywords, onRemoveKeywordItem, isLoading } = props;

  if (keywords.length === 0 || !isLoggedIn)
    return (
      <div className={s.noKeywordWrapper}>
        <span className={s.keywordContext}>You don't have any alerts.</span>
      </div>
    );

  const keywordItems = keywords.map(k => {
    return (
      <div className={s.keywordItemWrapper} key={k.id}>
        <span className={s.keywordContext}>{k.keyword}</span>
        <button
          className={s.deleteBtn}
          onClick={() => {
            const c = confirm(`Do you really want to DELETE "${k.keyword}" alert?`);

            if (c) {
              onRemoveKeywordItem(k.id, k.keyword);
            }
          }}
          disabled={isLoading}
        >
          <Icon icon="X_BUTTON" />
        </button>
      </div>
    );
  });

  return <div>{keywordItems}</div>;
};

export default KeywordItemList;
