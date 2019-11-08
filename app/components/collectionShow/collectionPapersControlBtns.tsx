import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { isEqual } from 'lodash';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';
import { CollectionShowState } from '../../containers/collectionShow/reducer';
import { ACTION_TYPES } from '../../actions/actionTypes';
import { AvailableExportCitationType } from '../../containers/paperShow/records';
import { exportCitationText } from '../../helpers/exportCitationText';
import ActionTicketManager from '../../helpers/actionTicketManager';
import Button from '../common/button';

const styles = require('./collectionPapersControlBtns.scss');

function exportMultiCitations(type: AvailableExportCitationType, selectedPaperIds: number[]) {
  let actionLabel;

  if (type === AvailableExportCitationType.RIS) {
    actionLabel = 'RIS';
  } else {
    actionLabel = 'BIBTEX';
  }

  exportCitationText(type, selectedPaperIds);

  ActionTicketManager.trackTicket({
    pageType: 'collectionShow',
    actionType: 'fire',
    actionArea: 'exportMultiCitationsButton',
    actionTag: 'citePaper',
    actionLabel,
  });
}

const MultiCitationExportDropdown: React.FC<{ selectedPaperIds: number[] }> = ({ selectedPaperIds }) => {
  const dropdownMenuEl = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsOpen(false);
      }}
    >
      <div ref={dropdownMenuEl}>
        <Button
          elementType="button"
          variant="text"
          color="black"
          onClick={() => setIsOpen(!isOpen)}
          disabled={selectedPaperIds.length === 0}
        >
          <Icon icon="CITATION" />
          <span>CITATION EXPORT</span>
        </Button>

        <Popper
          className={styles.citationExportDropdownMenu}
          modifiers={{
            preventOverflow: {
              enabled: false,
            },
            hide: {
              enabled: false,
            },
            flip: {
              enabled: false,
            },
          }}
          open={isOpen}
          anchorEl={dropdownMenuEl.current}
          placement="bottom-start"
          disablePortal
        >
          <div
            className={styles.menuItem}
            onClick={() => {
              exportMultiCitations(AvailableExportCitationType.RIS, selectedPaperIds);
              setIsOpen(false);
            }}
          >
            RIS
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              exportMultiCitations(AvailableExportCitationType.BIBTEX, selectedPaperIds);
              setIsOpen(false);
            }}
          >
            BibTeX
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

const CollectionPapersControlBtns: React.FC<{
  inOwnCollection: boolean;
  dispatch: Dispatch<any>;
  collectionShow: CollectionShowState;
  onRemovePaperCollection: (paperIds: number[]) => Promise<void>;
}> = ({ inOwnCollection, dispatch, collectionShow, onRemovePaperCollection }) => {
  const [checkedAll, setCheckedAll] = React.useState(false);

  React.useEffect(
    () => {
      setCheckedAll(isEqual(collectionShow.paperIds, collectionShow.selectedPaperIds));
    },
    [collectionShow.paperIds, collectionShow.selectedPaperIds]
  );

  if (!inOwnCollection) return null;

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

        <Button
          elementType="button"
          variant="text"
          color="black"
          onClick={() => {
            onRemovePaperCollection(collectionShow.selectedPaperIds);
            ActionTicketManager.trackTicket({
              pageType: 'collectionShow',
              actionType: 'fire',
              actionArea: 'multiPaperRemoveButton',
              actionTag: 'removeFromCollection',
              actionLabel: collectionShow.selectedPaperIds.join(','),
            });
          }}
          disabled={collectionShow.selectedPaperIds.length === 0}
        >
          <Icon icon="TRASH_CAN" />
          <span>DELETE</span>
        </Button>
        <MultiCitationExportDropdown selectedPaperIds={collectionShow.selectedPaperIds} />
      </div>
      <div className={styles.collectionControlBtnsDivider} />
    </div>
  );
};

export default connect()(withStyles<typeof CollectionPapersControlBtns>(styles)(CollectionPapersControlBtns));
