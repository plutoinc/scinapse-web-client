import * as React from 'react';
import { withStyles } from '../../../../helpers/withStylesHelper';
import Icon from '../../../../icons';
import { Link } from 'react-router-dom';
import PapersQueryFormatter, { FilterObject } from '../../../../helpers/papersQueryFormatter';
import * as classNames from 'classnames';
const styles = require('./noResultInSearch.scss');

interface NoResultInSearchProps {
  searchText?: string;
  filter?: FilterObject;
  otherCategoryCount: number;
  type: string;
}

const NoResultInSearch = (props: NoResultInSearchProps) => {
  const isAuthorType = props.type === 'author';
  return (
    <div className={styles.rootWrapper}>
      <div
        className={classNames({
          [styles.noAuthorItemResultContainer]: isAuthorType,
          [styles.noPaperItemResultContainer]: !isAuthorType,
        })}
      >
        <div className={styles.categoryItemHeader}>
          <span className={styles.categoryHeader}>{isAuthorType ? 'Author' : 'Paper'}</span>
          <span className={styles.categoryCount}>{props.otherCategoryCount}</span>
        </div>

        <div className={styles.noItemContainer}>
          <Icon className={styles.noResultItemIcon} icon={isAuthorType ? 'NO_AUTHOR_RESULT' : 'NO_PAPER_RESULT'} />
          <div className={styles.noItemAlertWrapper}>
            <div className={styles.noItemTitle}>
              No {props.type} results for {props.searchText}
            </div>
            <div className={styles.noItemContent}>
              {isAuthorType ? 'Did you intend to search for paper?' : `There are author results for ${props.type}`}
            </div>
            <Link
              to={{
                pathname: isAuthorType ? '/search' : '/search/authors',
                search: PapersQueryFormatter.stringifyPapersQuery({
                  query: props.searchText || '',
                  sort: 'RELEVANCE',
                  filter: {},
                  page: 1,
                }),
              }}
              className={styles.noItemButton}
            >
              See {isAuthorType ? 'paper' : 'author'} results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof NoResultInSearch>(styles)(NoResultInSearch);
