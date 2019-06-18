import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./affiliationsInfo.scss');

const AFFILIATIONS = [
  'noaa',
  'hkpc',
  'intel',
  'roche',
  'oxford',
  'harvard',
  'stanford',
  'california',
  'google',
  'tokyo',
  'cambridge',
  'ncgm',
];

const AffiliationsInfo: React.FC<{}> = () => {
  const affiliationList = AFFILIATIONS.map((affiliation, index) => {
    return (
      <div className={styles.affiliationImageWrapper} key={index}>
        <picture>
          <source srcSet={`https://assets.pluto.network/affiliations/${affiliation}.webp`} type="image/webp" />
          <source srcSet={`https://assets.pluto.network/affiliations/${affiliation}.jpg`} type="image/jpeg" />
          <img
            className={styles.affiliationImage}
            src={`https://assets.pluto.network/affiliations/${affiliation}.jpg`}
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
          Researchers from over <span className={styles.bold}>196</span> countries and
        </span>
        <br />
        <span>
          <span className={styles.bold}>1130</span> affiliations use Scinapse
        </span>
      </div>
      <div className={styles.contentBlockDivider} />
      <div className={styles.affiliationImageContainer}>
        <div className={styles.marqueeAffiliation}>{affiliationList}</div>
        <div className={styles.marqueeAffiliation}>{affiliationList}</div>
      </div>
    </div>
  );
};
export default withStyles<typeof AffiliationsInfo>(styles)(AffiliationsInfo);
