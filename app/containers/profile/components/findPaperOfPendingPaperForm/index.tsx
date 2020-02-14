import React, { FC, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { InputField } from '@pluto_network/pluto-design-elements';
import { getPaper } from '../../../../actions/paperShow';
import NonLinkablePaperItem from '../nonLinkablePaperItem';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./findPaperOfPendingPaperForm.scss');

const SCINAPSE_PAPER_SHOW_PREFIX = 'https://scinapse.io/papers/';

interface FindPaperOfPendingPaperFormProps {
  recommendedPaperId?: string;
}

const FindPaperOfPendingPaperForm: FC<FindPaperOfPendingPaperFormProps> = ({ recommendedPaperId }) => {
  useStyles(s);
  const dispatch = useDispatch();

  const [searchPaperUrl, setSearchPaperUrl] = useState<string>('');
  const [searchPaperId, setSearchPaperId] = useState<string>('');

  const onChangeUrlInputField = (e: React.FormEvent<HTMLInputElement>) => {
    const searchInput = e.currentTarget.value;
    setSearchPaperUrl(searchInput);
  };

  const searchPaper = useCallback(
    () => {
      const targetPaperId = searchPaperUrl.split(SCINAPSE_PAPER_SHOW_PREFIX)[1];
      setSearchPaperId(targetPaperId);

      if (targetPaperId) {
        dispatch(getPaper({ paperId: targetPaperId }));
      }
    },
    [dispatch, searchPaperUrl]
  );

  useEffect(
    () => {
      if (recommendedPaperId) {
        dispatch(getPaper({ paperId: recommendedPaperId }));
      }
    },
    [dispatch, recommendedPaperId]
  );

  return (
    <div>
      <div className={s.recommendedPaperItemWrapper}>
        {recommendedPaperId && <NonLinkablePaperItem paperId={recommendedPaperId} />}
      </div>
      <div className={s.searchPaperContainer}>
        <div className={s.searchInputWrapper}>
          <InputField
            value={searchPaperUrl}
            onChange={onChangeUrlInputField}
            onBlur={searchPaper}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                searchPaper();
              }
            }}
          />
        </div>
        <div className={s.searchPaperItemWrapper}>
          {searchPaperId && <NonLinkablePaperItem paperId={searchPaperId} />}
        </div>
      </div>
      <div>did'n find paper checkbox area</div>
      <div>footer button wrapper area</div>
    </div>
  );
};

export default FindPaperOfPendingPaperForm;
