import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./journalsInfo.scss');
const JOURNALS = [
  'nature',
  'science',
  'ieee',
  'cell',
  'acs',
  'aps',
  'lancet',
  'acm',
  'jama',
  'bmj',
  'pnas',
  'more-journals',
];

const MOBILE_JOURNALS = ['nature', 'science', 'lancet', 'acm', 'ieee', 'cell', 'more-journal-mobile'];

const JournalsInfo: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const journalList = (isMobile ? MOBILE_JOURNALS : JOURNALS).map((journal, index) => {
    return (
      <div className={styles.journalImageWrapper} key={index}>
        <picture>
          <source srcSet={`https://assets.pluto.network/journals/${journal}.webp`} type="image/webp" />
          <source srcSet={`https://assets.pluto.network/journals/${journal}.jpg`} type="image/jpeg" />
          <img
            className={styles.journalImage}
            src={`https://assets.pluto.network/journals/${journal}.jpg`}
            alt={`${journal}LogoImage`}
          />
        </picture>
      </div>
    );
  });

  return (
    <div className={styles.journalsInfo}>
      <div className={styles.title}>
        Covering <span className={styles.bold}>48,000+</span> journals and counting
      </div>
      <div className={styles.contentBlockDivider} />
      <div className={styles.journalListContainer}>{journalList}</div>
    </div>
  );
};
export default withStyles<typeof JournalsInfo>(styles)(JournalsInfo);
