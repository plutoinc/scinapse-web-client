import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import { JOURNALS, MOBILE_JOURNALS } from '../constants';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';

const styles = require('./journalsInfo.scss');

const JournalsInfo: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const journalList = (isMobile ? MOBILE_JOURNALS : JOURNALS).map((journal, index) => {
    return (
      <div className={styles.journalImageWrapper} key={index}>
        <picture>
          <source data-srcset={`https://assets.pluto.network/journals/${journal}.webp`} type="image/webp" />
          <source data-srcset={`https://assets.pluto.network/journals/${journal}.png`} type="image/png" />
          <img
            className={classNames([styles.journalImage, 'lazyload'])}
            data-sizes="auto"
            data-src={`https://assets.pluto.network/journals/${journal}.png`}
            alt={`${journal}LogoImage`}
          />
        </picture>
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
