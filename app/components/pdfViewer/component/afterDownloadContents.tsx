import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import SearchQueryInput from '../../common/InputWithSuggestionList/searchQueryInput';
import Icon from '../../../icons';
import RelatedPapers from '../../relatedPapers';
import { Paper } from '../../../model/paper';
const styles = require('./afterDownloadContents.scss');

interface AfterDownloadContentsProps {
  onClickReloadBtn: () => void;
  relatedPaperList: Paper[];
  isLoggedIn: boolean;
  isRelatedPaperLoading: boolean;
  title: string;
}

const SearchQueryBoxAtPaperShow: React.FC = () => {
  return (
    <div className={styles.afterDownloadSearchContainer}>
      <div className={styles.titleContext}>🔍 You can get more papers by searching!</div>
      <div tabIndex={0} className={styles.searchInputForm}>
        <SearchQueryInput maxCount={5} actionArea="paperShow" inputClassName={styles.searchInput} />
      </div>
    </div>
  );
};

const AfterDownloadContents: React.FC<AfterDownloadContentsProps> = props => {
  const { onClickReloadBtn, title } = props;

  return (
    <>
      <div className={styles.afterDownloadContainer}>
        <div className={styles.titleContext}>Thanks for downloading</div>
        <div className={styles.subContext}>“{title}"</div>
        <button className={styles.reloadBtn} onClick={() => onClickReloadBtn()}>
          <Icon icon="RELOAD" className={styles.reloadIcon} />
          Reload Paper
        </button>
      </div>
      <SearchQueryBoxAtPaperShow />
      <RelatedPapers />
    </>
  );
};

export default withStyles<typeof AfterDownloadContents>(styles)(AfterDownloadContents);
