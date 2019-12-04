import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import { JOURNALS, MOBILE_JOURNALS } from '../constants';
import LazyImage from '../../common/lazyImage';

const styles = require('./journalsInfo.scss');

const JournalsInfo: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const journalList = (isMobile ? MOBILE_JOURNALS : JOURNALS).map((journal, index) => {
    return (
      <div className={styles.journalImageWrapper} key={index}>
        <LazyImage
          src={`https://assets.pluto.network/journals/${journal}.png`}
          webpSrc={`https://assets.pluto.network/journals/${journal}.webp`}
          imgClassName={styles.journalImage}
          loading="lazy"
          alt={`${journal}LogoImage`}
        />
      </div>
    );
  });

  return (
    <div className={styles.journalsInfo}>
      <div className={styles.title}>
        Covering <span className={styles.bold}>48,000</span> journals and counting
      </div>
      <div className={styles.contentBlockDivider} />
      <div className={styles.journalListContainer}>{journalList}</div>
    </div>
  );
};
export default withStyles<typeof JournalsInfo>(styles)(JournalsInfo);
