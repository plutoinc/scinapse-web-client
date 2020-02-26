import React, { useState, useMemo, useEffect } from 'react';
import { chunk } from 'lodash';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';
import PendingPaperItem from '../pendingPaperItem';
import Icon from '../../../../icons';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../reducers';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./pendingPaperList.scss');

interface PendingPaperListProps {
  papers: PendingPaper[];
  isEditable: boolean;
}

const PendingPaperList: React.FC<PendingPaperListProps> = props => {
  useStyles(s);

  const { papers, isEditable } = props;

  const chunkedPapers = useMemo(() => chunk(papers, 5), [papers]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPapers, setShowPapers] = useState<PendingPaper[]>(chunkedPapers[0]);
  const { isLoading } = useSelector((state: AppState) => ({
    isLoading: state.profilePendingPaperListState.isLoading,
  }));

  useEffect(() => {
    if (currentIndex === 0) {
      setShowPapers(chunkedPapers[0]);
    } else {
      const nextShowPapers = [];
      for (let i = 0; i <= currentIndex; i++) {
        if (!!chunkedPapers[i]) {
          nextShowPapers.push(...chunkedPapers[i]);
        }
      }
      setShowPapers(nextShowPapers);
    }
  }, [chunkedPapers, currentIndex]);

  const paperList = useMemo(() => {
    if (!showPapers || showPapers.length === 0) return null;

    return showPapers.map(paper => (
      <PendingPaperItem paper={paper} key={paper.id} isEditable={isEditable} isLoadingToResolved={isLoading} />
    ));
  }, [showPapers, isEditable, isLoading]);

  const moreLessButton = useMemo(() => {
    if (chunkedPapers.length <= 1) return null;

    if (currentIndex + 1 < chunkedPapers.length)
      return (
        <div
          className={s.paperLoadButton}
          onClick={() => {
            setCurrentIndex(currentIndex + 1);
          }}
        >
          VIEW MORE
          <Icon className={s.paperLoadIcon} icon="ARROW_DOWN" />
        </div>
      );

    return (
      <div
        className={s.paperLoadButton}
        onClick={() => {
          setCurrentIndex(0);
          setShowPapers(chunkedPapers[0]);
        }}
      >
        VIEW LESS
        <Icon className={s.paperLoadIcon} icon="ARROW_UP" />
      </div>
    );
  }, [currentIndex, chunkedPapers]);

  return (
    <>
      <div className={s.contentBox}>
        {paperList}
        {moreLessButton}
      </div>
    </>
  );
};

export default PendingPaperList;
