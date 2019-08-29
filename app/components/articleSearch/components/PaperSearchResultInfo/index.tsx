import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '../../../../helpers/withStylesHelper';
import PaperSearchQueryFormatter from '../../../../helpers/searchQueryManager';
import formatNumber from '../../../../helpers/formatNumber';
const styles = require('../../articleSearch.scss');

interface PaperSearchResultInfoProps {
  suggestionKeyword: string;
  searchFromSuggestion: boolean;
  query: string;
  docCount: number;
  shouldShowTitle: boolean;
  matchingPhrases: string[];
}

const PaperSearchResultInfo: React.FC<PaperSearchResultInfoProps> = ({
  searchFromSuggestion,
  suggestionKeyword,
  query,
  shouldShowTitle,
  docCount,
  matchingPhrases,
}) => {
  let title = null;
  if (shouldShowTitle) {
    title = <div className={styles.categoryHeader}>Publication</div>;
  }

  let additionalContent = (
    <span className={styles.additionalContent}>
      {`Showing results for `}
      <span className={styles.boldQuery}>{query}</span>
    </span>
  );

  if (matchingPhrases && matchingPhrases.length > 0) {
    const clearPhrases = matchingPhrases.map((phrases, i) => {
      if (i < matchingPhrases.length - 1) return `"${phrases}", `;
      else return `"${phrases}"`;
    });

    additionalContent = (
      <span className={styles.additionalContent}>
        {`Showing results for `}
        <span className={styles.boldQuery}>{query.replace(/"/g, '')}</span>
        {` ( Exact matching results for `}
        <span className={styles.boldMatchingPhrases}>{clearPhrases}</span>
        {`. )`}
      </span>
    );
  }

  if (searchFromSuggestion && suggestionKeyword) {
    additionalContent = (
      <span className={styles.additionalContent}>
        {`No result for `}
        <span className={styles.wrongQuery}>{query}</span>
        <span>{`. Showing results for `}</span>
        <Link
          to={{
            pathname: '/search',
            search: PaperSearchQueryFormatter.stringifyPapersQuery({
              query: suggestionKeyword,
              sort: 'RELEVANCE',
              filter: {},
              page: 1,
            }),
          }}
          className={styles.suggestionKeyword}
        >
          {suggestionKeyword}
        </Link>
      </span>
    );
  }

  if (!searchFromSuggestion && suggestionKeyword) {
    additionalContent = (
      <span className={styles.additionalContent}>
        {`Showing results for `}
        <span className={styles.weirdQuery}>{query}</span>
        <span>{`. Did you mean `}</span>
        <Link
          to={{
            pathname: '/search',
            search: PaperSearchQueryFormatter.stringifyPapersQuery({
              query: suggestionKeyword,
              sort: 'RELEVANCE',
              filter: {},
              page: 1,
            }),
          }}
          className={styles.suggestionLink}
        >
          {suggestionKeyword}
        </Link>
        <span>?</span>
      </span>
    );
  }

  return (
    <div>
      {title}
      <div className={styles.categoryCount}>
        {formatNumber(docCount)}
        {docCount > 1 ? ' Papers' : ' Paper'}
        <span className={styles.countDivider}>|</span>
        {additionalContent}
      </div>
    </div>
  );
};

export default withStyles<typeof PaperSearchResultInfo>(styles)(PaperSearchResultInfo);
