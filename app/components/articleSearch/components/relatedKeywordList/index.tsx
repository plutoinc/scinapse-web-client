import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '../../../../helpers/withStylesHelper';
import PapersQueryFormatter from '../../../../helpers/papersQueryFormatter';
const styles = require('./relatedKeywordList.scss');

interface RelatedKeywordListProps {
  keywordList: string[];
  shouldRender: boolean;
  query: string;
}

const RelatedKeywordList: React.SFC<RelatedKeywordListProps> = ({ keywordList, shouldRender, query }) => {
  if (!shouldRender || keywordList.length === 0) {
    return null;
  }

  const relatedKeywordItems = keywordList.filter(k => query.indexOf(k) === -1).map(keyword => (
    <div key={keyword} className={styles.relatedKeywords}>
      <Link
        to={{
          pathname: '/search',
          search: PapersQueryFormatter.stringifyPapersQuery({
            query: `${query} ${keyword}`,
            sort: 'RELEVANCE',
            filter: {},
            page: 1,
          }),
        }}
      >
        {keyword.toLowerCase()}
      </Link>
    </div>
  ));

  return <div className={styles.relatedKeywordsContainer}>{relatedKeywordItems}</div>;
};

export default withStyles<typeof RelatedKeywordList>(styles)(RelatedKeywordList);
