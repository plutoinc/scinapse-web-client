import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./journalsInfo.scss');

const JournalsInfo: React.FC<{}> = () => {
  return (
    <div className={styles.journalsInfo}>
      <div className={styles.title}>Covering 48,000+ journals and counting</div>
      <div className={styles.contentBlockDivider} />
    </div>
  );
};
export default withStyles<typeof JournalsInfo>(styles)(JournalsInfo);
