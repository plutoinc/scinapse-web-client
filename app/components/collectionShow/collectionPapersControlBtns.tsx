import React from 'react';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';
const styles = require('./collectionPapersControlBtns.scss');

const CollectionPapersControlBtns: React.FC<{ itsMine: boolean }> = ({ itsMine }) => {
  if (!itsMine) return null;

  return (
    <div>
      <div className={styles.collectionControlBtnsWrapper}>
        <button className={styles.collectionControlBtn}>
          <Icon icon="TRASH_CAN" className={styles.deleteIcon} />DELETE
        </button>
        <button className={styles.collectionControlBtn}>
          <Icon icon="CITED" className={styles.citedIcon} />CITATION EXPORT
        </button>
      </div>
      <div className={styles.collectionControlBtnsDivider} />
    </div>
  );
};

export default withStyles<typeof CollectionPapersControlBtns>(styles)(CollectionPapersControlBtns);
