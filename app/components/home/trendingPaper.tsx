import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '../../helpers/withStylesHelper';
import { TrendingPaper, TRENDING_PAPERS } from './trendingPaperData';
import ActionTicketManager from '../../helpers/actionTicketManager';
const styles = require('./home.scss');

const TrendingPaperItem: React.FunctionComponent<{}> = () => {
  const trendingPapers = TRENDING_PAPERS.map(paper => {
    const { paperId, paperTitle, year, journalTitle, authors } = paper;

    const authorNodes = authors.map((author, index) => {
      const isLastAuthor = authors.length - 1 === index;
      return (
        <span key={index}>
          {author}
          {!isLastAuthor ? <span>{`, `}</span> : null}
        </span>
      );
    });

    return (
      <Link
        key={paperId}
        to={`/papers/${paperId}`}
        className={styles.trendingPaperItemWrapper}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: 'home',
            actionType: 'fire',
            actionArea: 'trendingPapers',
            actionTag: 'paperShow',
            actionLabel: String(paperId),
          });
        }}
      >
        <div className={styles.trendingPaperTitle}>{paperTitle}</div>
        <div className={styles.trendingPaperVenueAndAuthor}>
          {`${year} ・ ${journalTitle} | `}
          {authorNodes}
        </div>
      </Link>
    );
  });

  return <>{trendingPapers}</>;
};

const TrendingPaper: React.FunctionComponent<{}> = () => {
  return (
    <div className={styles.trendingPaperContainer}>
      <div className={styles.contentBlockDivider} />
      <div className={styles.contextSubtitle}>TRENDING PAPERS</div>
      <TrendingPaperItem />
    </div>
  );
};

export default withStyles<typeof TrendingPaper>(styles)(TrendingPaper);
