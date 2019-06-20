import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import { JOURNALS, MOBILE_JOURNALS } from '../constants';
const styles = require('./journalsInfo.scss');

const JournalsInfo: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const journalList = (isMobile ? MOBILE_JOURNALS : JOURNALS).map((journal, index) => {
    return (
      <div className={styles.journalImageWrapper} key={index}>
        <picture>
          <source srcSet={`https://assets.pluto.network/journals/${journal.name}.webp`} type="image/webp" />
          <source srcSet={`https://assets.pluto.network/journals/${journal.name}.jpg`} type="image/jpeg" />
          <img
            style={journal.logoStyle}
            src={`https://assets.pluto.network/journals/${journal.name}.jpg`}
            alt={`${journal.name}LogoImage`}
          />
        </picture>
      </div>
    );
  });

  return (
    <div className={styles.journalsInfo}>
      <div className={styles.title}>Covering 48,000+ journals and counting</div>
      <div className={styles.contentBlockDivider} />
      <div className={styles.journalListContainer}>{journalList}</div>
    </div>
  );
};
export default withStyles<typeof JournalsInfo>(styles)(JournalsInfo);
