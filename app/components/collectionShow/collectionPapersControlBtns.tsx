import React from 'react';
import Icon from '../../icons';
import { isEqual } from 'lodash';
import { withStyles } from '../../helpers/withStylesHelper';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CollectionShowState } from '../../containers/collectionShow/reducer';
import { ACTION_TYPES } from '../../actions/actionTypes';
const styles = require('./collectionPapersControlBtns.scss');

const CollectionPapersControlBtns: React.FC<{
  itsMine: boolean;
  dispatch: Dispatch<any>;
  collectionShow: CollectionShowState;
  onRemovePaperCollection: (paperIds: number[]) => Promise<void>;
}> = ({ itsMine, dispatch, collectionShow, onRemovePaperCollection }) => {
  const [checkedAll, setCheckedAll] = React.useState(false);

  React.useEffect(
    () => {
      setCheckedAll(isEqual(collectionShow.paperIds, collectionShow.selectedPaperIds));
    },
    [collectionShow.paperIds, collectionShow.selectedPaperIds]
  );

  if (!itsMine) return null;

  return (
    <div>
      <div className={styles.collectionControlBtnsWrapper}>
        <input
          className={styles.allCheckBox}
          type="checkbox"
          checked={checkedAll}
          onClick={() => {
            dispatch({
              type: ACTION_TYPES.COLLECTION_SHOW_SELECT_ALL_PAPER_ITEMS,
              payload: { paperIds: collectionShow.paperIds },
            });
          }}
          readOnly
        />
        <button
          className={styles.collectionControlBtn}
          onClick={() => onRemovePaperCollection(collectionShow.selectedPaperIds)}
        >
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

export default connect()(withStyles<typeof CollectionPapersControlBtns>(styles)(CollectionPapersControlBtns));
