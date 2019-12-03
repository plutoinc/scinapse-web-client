import React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import { AFFILIATIONS } from '../constants';
import classNames from 'classnames';
import 'lazysizes';
const styles = require('./affiliationsInfo.scss');

const AffiliationsInfo: React.FC = () => {
  const affiliationList = AFFILIATIONS.map((affiliation, index) => {
    return (
      <div className={styles.affiliationImageWrapper} key={index}>
        <picture>
          <source srcSet={`https://assets.pluto.network/affiliations/${affiliation}.webp`} type="image/webp" />
          <source srcSet={`https://assets.pluto.network/affiliations/${affiliation}.jpg`} type="image/jpeg" />
          <img
            className={classNames([styles.affiliationImage, 'lazyload'])}
            data-src={`https://assets.pluto.network/affiliations/${affiliation}.jpg`}
            alt={`${affiliation}LogoImage`}
          />
        </picture>
      </div>
    );
  });

  return (
    <div className={styles.affiliationsInfo}>
      <div className={styles.title}>
        <span>
          Users from over <span className={styles.bold}>196</span> countries and
        </span>
        <br />
        <span>
          <span className={styles.bold}>1,130</span> affiliations use Scinapse
        </span>
      </div>
      <div className={styles.contentBlockDivider} />
      <div className={styles.affiliationImageContainer}>
        <div className={styles.marquee1Affiliation}>{affiliationList}</div>
        <div className={styles.marquee2Affiliation}>{affiliationList}</div>
      </div>
    </div>
  );
};
export default withStyles<typeof AffiliationsInfo>(styles)(AffiliationsInfo);
