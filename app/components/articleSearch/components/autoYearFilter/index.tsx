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
        Year filter applied : <span className={styles.detectedYear}>{detectedYear}</span>
      </div>
      <div>
        If you want to remove year filter,{' '}
        <button className={styles.removeFilterBtn} onClick={() => handleSetUseAutoYearFilter(false)}>
          click here
        </button>
      </div>
    </div>
  );
};

export default withStyles<typeof AutoYearFilter>(styles)(AutoYearFilter);
