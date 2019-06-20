import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./skeletonPaperItem.scss');

const SkeletonPaperItem: React.FC<{}> = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonLargeContent} />
      <div className={styles.skeletonSmallContent} />
    </div>
  );
};

export default withStyles<typeof SkeletonPaperItem>(styles)(SkeletonPaperItem);
