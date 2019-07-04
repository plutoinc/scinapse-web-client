import React from 'react';
import { withStyles } from '../../../../helpers/withStylesHelper';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
const styles = require('./autoYearFilter.scss');

interface AutoYearFilterProps {
  query: string | undefined;
  detectedYear: number | null;
  handleSetUseAutoYearFilter: (value: React.SetStateAction<boolean>) => void;
}

const AutoYearFilter: React.FC<AutoYearFilterProps> = ({ query, detectedYear, handleSetUseAutoYearFilter }) => {
  React.useEffect(
    () => {
      if (detectedYear) {
        ActionTicketManager.trackTicket({
          pageType: 'searchResult',
          actionType: 'fire',
          actionArea: 'autoYearFilter',
          actionTag: 'autoYearFilterQuery',
          actionLabel: query!,
        });
      }
    },
    [detectedYear]
  );

  if (!detectedYear) return null;

  return (
    <div className={styles.autoYearFilterBox}>
      <div>
        Year filter applied : <span className={styles.detectedYear}>{detectedYear}</span>
      </div>
      <div className={styles.removeContext}>
        If you want to remove year filter,{' '}
        <button
          className={styles.removeFilterBtn}
          onClick={() => {
            handleSetUseAutoYearFilter(false);

            ActionTicketManager.trackTicket({
              pageType: 'searchResult',
              actionType: 'fire',
              actionArea: 'filter',
              actionTag: 'cancelAutoYearFilter',
              actionLabel: query!,
            });
          }}
        >
          click here
        </button>
      </div>
    </div>
  );
};

export default withStyles<typeof AutoYearFilter>(styles)(AutoYearFilter);
