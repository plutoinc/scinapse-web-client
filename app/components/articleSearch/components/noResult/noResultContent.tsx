import * as React from 'react';
import { withStyles } from '../../../../helpers/withStylesHelper';
import FilterResetButton from '../../../filterContainer/filterResetButton';
const styles = require('./noResult.scss');

interface NoResultContentProps {
  hasEmptyFilter: boolean;
  doiPatternMatched: boolean;
  doi: string | null;
  searchText: string | null;
  handleSetIsOpen: () => void;
}

const DisabledFilterMessage: React.FunctionComponent<{ hasEmptyFilter: boolean }> = React.memo(props => {
  const { hasEmptyFilter } = props;
  if (hasEmptyFilter) {
    return null;
  } else {
    return (
      <li>
        <span className={styles.noPapersText}>
          Try <b>disabling</b> the filter.
          <FilterResetButton
            text="Reset All"
            btnStyle={{
              position: 'relative',
              top: 0,
              fontSize: '15px',
              marginLeft: '4px',
              fontWeight: 500,
              color: '#3e7fff',
            }}
          />
        </span>
      </li>
    );
  }
});

function noResultDoiSearchContent(
  searchText: string | null,
  doi: string,
  hasEmptyFilter: boolean,
  handleSetIsOpen: () => void
) {
  return (
    <>
      <b>Scinapse</b> found no result for <b className={styles.keyword}>"{searchText}".</b>
      <ul className={styles.contextWrapper}>
        <DisabledFilterMessage hasEmptyFilter={hasEmptyFilter} />
        <li>
          <span className={styles.noPapersText}>
            Please <b>double-check</b> the DOI is correct.
          </span>
        </li>
        <li>
          <span className={styles.noPapersText}>
            Scinapse may not include the paper. Try visiting{' '}
            <a
              className={styles.doiLink}
              rel="noopener nofollow noreferrer"
              target="_blank"
              href={`https://doi.org/${doi}`}
            >
              the original
            </a>{' '}
            or{' '}
            <b className={styles.paperRequestLink} onClick={handleSetIsOpen}>
              Request
            </b>{' '}
            inclusion.
          </span>
        </li>
      </ul>
    </>
  );
}

function noResultGeneralSearchContent(searchText: string | null, hasEmptyFilter: boolean, handleSetIsOpen: () => void) {
  return (
    <>
      <b>Scinapse</b> found no result for <b className={styles.keyword}>"{searchText}".</b>
      <ul className={styles.contextWrapper}>
        <DisabledFilterMessage hasEmptyFilter={hasEmptyFilter} />
        <li>
          <span className={styles.noPapersText}>
            Please check if all words are <b>spelled</b> correctly.
          </span>
        </li>
        <li>
          <span className={styles.noPapersText}>
            Please check the <b>spacing</b> between keywords.
          </span>
        </li>
        <li>
          <span className={styles.noPapersText}>
            Try to reduce <b>the number of keywords</b> or use <b>common terms</b>.
          </span>
        </li>
        <li>
          <span className={styles.noPapersText}>
            Sometimes we may not include the paper you're looking for. We will comply when you{' '}
            <b className={styles.paperRequestLink} onClick={handleSetIsOpen}>
              request.
            </b>
          </span>
        </li>
      </ul>
    </>
  );
}

const NoResultContent: React.FunctionComponent<NoResultContentProps> = props => {
  const { hasEmptyFilter, doiPatternMatched, doi, searchText, handleSetIsOpen } = props;

  if (doiPatternMatched && !!doi) {
    return noResultDoiSearchContent(searchText, doi, hasEmptyFilter, handleSetIsOpen);
  } else {
    return noResultGeneralSearchContent(searchText, hasEmptyFilter, handleSetIsOpen);
  }
};

export default withStyles<typeof NoResultContent>(styles)(NoResultContent);
