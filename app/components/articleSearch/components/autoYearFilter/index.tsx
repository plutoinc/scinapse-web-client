import React from 'react';
import { withStyles } from '../../../../helpers/withStylesHelper';
const styles = require('./autoYearFilter.scss');

interface AutoYearFilterProps {
  detectedYear: number | null;
  handleSetUseAutoYearFilter: (value: React.SetStateAction<boolean>) => void;
}

const AutoYearFilter: React.FC<AutoYearFilterProps> = ({ detectedYear, handleSetUseAutoYearFilter }) => {
  if (!detectedYear) return null;
  return (
    <div className={styles.autoYearFilterBox}>
      <div>
        Showing results filtered to <span className={styles.detectedYear}>{detectedYear}</span>
      </div>
      <div>
        If you do not want filtered results,{' '}
        <button className={styles.removeFilterBtn} onClick={() => handleSetUseAutoYearFilter(false)}>
          remove
        </button>{' '}
        year filter.
      </div>
    </div>
  );
};

export default withStyles<typeof AutoYearFilter>(styles)(AutoYearFilter);
