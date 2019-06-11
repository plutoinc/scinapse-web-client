import * as React from 'react';
import { Link } from 'react-router-dom';
import { SearchPageQueryParams } from '../../types';
import { withStyles } from '../../../../helpers/withStylesHelper';
import PaperSearchQueryFormatter from '../../../../helpers/searchQueryManager';
const styles = require('../../articleSearch.scss');

interface SuggestionsProps {
  suggestionKeyword: string;
  searchFromSuggestion: boolean;
  queryParams: SearchPageQueryParams;
}

const Suggestions: React.FC<SuggestionsProps> = ({ searchFromSuggestion, suggestionKeyword, queryParams }) => {
  if (!searchFromSuggestion && !suggestionKeyword) return null;

  if (searchFromSuggestion) {
    return (
      <div className={styles.suggestionBox}>
        <div className={styles.noResult}>
          {`No result found for `}
          <b>{queryParams.query}</b>
        </div>
        <div className={styles.suggestionResult}>
          {`Showing results for `}
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
          >
            <b>{suggestionKeyword}</b>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.suggestionBox}>
      <span>{`Did you mean `}</span>
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
        <b>{suggestionKeyword}</b>
      </Link>
      <span>{` ?`}</span>
    </div>
  );
};

export default withStyles<typeof Suggestions>(styles)(Suggestions);
