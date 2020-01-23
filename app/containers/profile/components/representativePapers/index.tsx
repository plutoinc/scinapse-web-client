import React, { FC, memo } from 'react';
import { Author } from '../../../../model/author/author';
import { FullPaperItemWithPaper } from '../../../../components/common/paperItem/fullPaperItem';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('../../connectedAuthor.scss');

interface Props {
  author: Author;
  isMine: boolean;
  onClickManageButton: () => void;
}

const RepresentativePaperListSection: FC<Props> = memo(({ author, isMine, onClickManageButton }) => {
  useStyles(s);
  const { representativePapers } = author;

  let paperList;
  if (!representativePapers || !representativePapers.length) {
    paperList = (
      <div className={s.noPaperWrapper}>
        <div className={s.noPaperDescription}>There is no representative papers.</div>
      </div>
    );
  } else {
    paperList = representativePapers.map(paper => (
      <FullPaperItemWithPaper key={paper.id} pageType="authorShow" actionArea="paperList" paper={paper} />
    ));
  }

  const hasNoPapers = isMine && (!representativePapers || representativePapers.length === 0);

  return (
    <>
      <div className={s.selectedPublicationSection}>
        <div className={s.sectionHeader}>
          <span className={s.sectionTitle}>Representative Publications</span>
          <span className={s.countBadge}>{representativePapers ? representativePapers.length : 0}</span>
          <div className={s.rightBox}>
            {isMine && (
              <Button elementType="button" size="small" variant="outlined" color="gray" onClick={onClickManageButton}>
                <Icon icon="PEN" />
                <span>Manage List</span>
              </Button>
            )}
          </div>
        </div>
        <div className={s.selectedPaperDescription} />
        {paperList}
        <div className={s.selectedPaperWrapper}>
          {hasNoPapers && (
            <Button
              elementType="button"
              size="small"
              variant="outlined"
              color="gray"
              onClick={onClickManageButton}
              style={{
                marginTop: '16px',
              }}
            >
              <Icon icon="PLUS" />
              <span>Add Representative Publication</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
});

export default RepresentativePaperListSection;
