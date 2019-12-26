import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./searchingPDFBtn.scss');

interface SearchingPDFBtnProps {
  isLoading: boolean;
}

const SearchingPDFBtn: React.FunctionComponent<SearchingPDFBtnProps> = props => {
  const { isLoading } = props;

  return (
    <button className={styles.loadingBtnStyle} disabled={isLoading}>
      <div className={styles.spinnerWrapper}>
        <CircularProgress color="inherit" disableShrink={true} size={14} thickness={4} />
      </div>
      Searching Paper
    </button>
  );
};

export default withStyles<typeof SearchingPDFBtn>(styles)(SearchingPDFBtn);
