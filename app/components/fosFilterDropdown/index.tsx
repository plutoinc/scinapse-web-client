import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '../../helpers/withStylesHelper';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { ACTION_TYPES, SearchActions } from '../../actions/actionTypes';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import { AppState } from '../../reducers';
import { trackSelectFilter } from '../../helpers/trackSelectFilter';
import makeNewFilterLink from '../../helpers/makeNewFilterLink';
import FOSFilterInput from '../fosFilterInput';
import FOSItem from './fosItem';
import { AggregationFos } from '../../model/aggregation';
import Button from '../common/button';

const s = require('./fosFilterDropdown.scss');

interface FOSFilterDropdownProps {
  dispatch: Dispatch<SearchActions>;
}

const FOSFilterDropdown: React.FC<
  FOSFilterDropdownProps & ReturnType<typeof mapStateToProps> & RouteComponentProps
> = props => {
  const [isHintOpened, setIsHintOpened] = React.useState(false);
  const inputEl = React.useRef<HTMLInputElement | null>(null);
  const anchorEl = React.useRef(null);
  const [lastSelectedFOS, setLastSelectedFOS] = React.useState(props.selectedFOSIds);
  const selectChanged = !isEqual(props.selectedFOSIds, lastSelectedFOS);

  React.useEffect(
    () => {
      if (!props.isActive) {
        setLastSelectedFOS(props.selectedFOSIds);
      }
    },
    [props.isActive, props.selectedFOSIds]
  );

  let buttonText = 'Any topic';
  if (props.selectedFOSIds.length === 1) {
    buttonText = `${props.selectedFOSIds.length} topic`;
  } else if (props.selectedFOSIds.length > 1) {
    buttonText = `${props.selectedFOSIds.length} topics`;
  }

  const FOSList = props.FOSData.map(FOS => {
    return (
      <FOSItem
        key={FOS.id}
        FOS={FOS}
        selected={props.selectedFOSIds.includes(FOS.id)}
        onClick={() => {
          props.dispatch({
            type: ACTION_TYPES.ARTICLE_SEARCH_SELECT_FOS_FILTER_ITEM,
            payload: { FOSId: FOS.id },
          });
        }}
      />
    );
  });

  function handleSubmit() {
    props.dispatch(setActiveFilterButton(null));

    if (selectChanged) {
      trackSelectFilter('FOS', JSON.stringify(props.selectedFOSIds));
      const link = makeNewFilterLink({ fos: props.selectedFOSIds }, props.location);
      props.history.push(link);
    }
  }

  return (
    <div ref={anchorEl}>
      <FilterButton
        onClick={() => {
          if (props.isActive) {
            props.dispatch(setActiveFilterButton(null));
          } else {
            props.dispatch(setActiveFilterButton(FILTER_BUTTON_TYPE.FOS));
          }
        }}
        content={buttonText}
        isActive={props.isActive}
        selected={props.selectedFOSIds.length > 0}
      />
      <Popover
        onClose={() => {
          if (props.isActive) {
            handleSubmit();
          }
        }}
        open={props.isActive}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        elevation={0}
        transitionDuration={150}
        classes={{
          paper: s.dropBoxWrapper,
        }}
      >
        <div className={s.filterWrapper}>
          <FOSFilterInput
            forwardedRef={inputEl}
            onSubmit={(FOSList: AggregationFos[]) => {
              props.dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_ADD_FOS_FILTER_ITEMS, payload: { FOSList } });
            }}
          />
          {isHintOpened && (
            <ClickAwayListener
              onClickAway={() => {
                setIsHintOpened(false);
              }}
            >
              <div className={s.hintWrapper}>
                <div className={s.hint}>Search other topics here</div>
              </div>
            </ClickAwayListener>
          )}
        </div>
        <div className={s.content}>
          <div className={s.FOSListWrapper}>
            <div className={s.listHeader}>
              <label className={s.FOSLabel}>Topic</label>
              <label className={s.countLabel}>Count</label>
            </div>
            {FOSList}
            <div className={s.searchInfo}>
              <span>{`Couldn't find topics? `}</span>
              <button
                onClick={() => {
                  if (!inputEl.current) return;
                  setIsHintOpened(true);
                  inputEl.current.focus();
                }}
                className={s.searchFocusButton}
              >
                Search more topics!
              </button>
            </div>
          </div>
          <div className={s.controlBtnsWrapper}>
            <Button
              elementType="button"
              variant="text"
              color="gray"
              onClick={() => {
                props.dispatch({
                  type: ACTION_TYPES.ARTICLE_SEARCH_CLEAR_FOS_FILTER,
                });
              }}
            >
              <span>Clear</span>
            </Button>
            <Button elementType="button" variant="text" color="blue" onClick={handleSubmit}>
              <span>Apply</span>
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    selectedFOSIds: state.searchFilterState.selectedFOSIds,
    FOSData: state.searchFilterState.fosList,
    isActive: state.searchFilterState.activeButton === FILTER_BUTTON_TYPE.FOS,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof FOSFilterDropdown>(s)(FOSFilterDropdown)));
