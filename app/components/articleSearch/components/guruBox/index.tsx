import * as React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../../icons';
import { withStyles } from '../../../../helpers/withStylesHelper';
import { MatchEntityAuthor } from '../../../../api/search';
const styles = require('./guruBox.scss');

const MAX_AUTHOR_COUNT = 4;
const MAX_H_INDEX_WIDTH = 48;
const MIN_H_INDEX_WIDTH = 12;

interface GuruBoxProps {
  authors: MatchEntityAuthor[] | null;
}

const GuruItemBox: React.FC<{ author: MatchEntityAuthor; shouldShowTopPaper: boolean; hIndexLineWidth: number }> = ({
  author,
  shouldShowTopPaper,
  hIndexLineWidth,
}) => {
  let hIndexBox = null;
  if (author.hindex) {
    hIndexBox = (
      <div className={styles.rightBox}>
        <div className={styles.hIndexTitle}>H-Index</div>
        <div className={styles.hIndexCount}>{author.hindex}</div>
        <div style={{ width: `${hIndexLineWidth}px` }} className={styles.hIndexLine} />
      </div>
    );
  }

  let topPaperBox = null;
  if (shouldShowTopPaper && author.topPapers && author.topPapers.length > 0) {
    topPaperBox = (
      <div className={styles.topPaperBox}>
        <div className={styles.topPaperBoxTitle}>TOP PAPER</div>
        <div className={styles.topPaperTitle}>{author.topPapers[0].title}</div>
        <div className={styles.citationCount}>{`${author.topPapers[0].citedCount} Citations`}</div>
      </div>
    );
  }

  return (
    <Link to={`/authors/${author.id}`} className={styles.authorItem}>
      <div className={styles.upperBox}>
        <div className={styles.authorName}>{author.name}</div>
        <div className={styles.fosList}>{author.fosList.slice(0, 3).join('・')}</div>
        {hIndexBox}
      </div>
      {topPaperBox}
    </Link>
  );
};

const GuruBox: React.FC<GuruBoxProps> = React.memo(({ authors }) => {
  if (!authors || authors.length === 0) return null;

  const hIndexArr = authors.slice(0, MAX_AUTHOR_COUNT).map(author => author.hindex || 0);
  const maxHIndex = Math.max(...hIndexArr);
  const minHIndex = Math.min(...hIndexArr);

  const diffUnit = (MAX_H_INDEX_WIDTH - MIN_H_INDEX_WIDTH) / (maxHIndex - minHIndex);

  const authorList = authors.slice(0, MAX_AUTHOR_COUNT).map((author, index) => {
    const hIndexLineWidth = minHIndex - (author.hindex || 0) * diffUnit + MIN_H_INDEX_WIDTH;
    return (
      <GuruItemBox author={author} key={author.id} shouldShowTopPaper={index === 0} hIndexLineWidth={hIndexLineWidth} />
    );
  });

  return (
    <div className={styles.guruBoxWrapper}>
      <div className={styles.titleWrapper}>
        <Icon className={styles.authorIcon} icon="AUTHOR" />
        <span className={styles.title}>FEATURED AUTHORS</span>
      </div>
      {authorList}
    </div>
  );
});

export default withStyles<typeof GuruBox>(styles)(GuruBox);
