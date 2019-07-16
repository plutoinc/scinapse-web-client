import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as classNames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withStyles } from '../../helpers/withStylesHelper';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { ACTION_TYPES, SearchActions } from '../../actions/actionTypes';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import { AppState } from '../../reducers';
import { trackSelectFilter } from '../../helpers/trackSelectFilter';
import makeNewFilterLink from '../../helpers/makeNewFilterLink';
import { AggregationFos } from '../../model/aggregation';

const s = require('./fosFilterDropdown.scss');

interface FOSFilterDropdownProps {
  dispatch: Dispatch<SearchActions>;
}

interface FOSItemProps {
  FOS: AggregationFos;
  selected: boolean;
  onClick: () => void;
}

const FOSItem: React.FC<FOSItemProps> = ({ FOS, onClick, selected }) => {
  return (
    <button
      onClick={onClick}
      className={classNames({
        [s.FOSItemBtn]: true,
        [s.selected]: selected,
      })}
    >
      <span className={s.fosName}>{FOS.name}</span>
      <span className={s.docCount}>{`(${FOS.docCount})`}</span>
    </button>
  );
};

const FOSFilterDropdown: React.FC<
  FOSFilterDropdownProps & ReturnType<typeof mapStateToProps> & RouteComponentProps
> = props => {
  const anchorEl = React.useRef(null);

  let buttonText = 'Any field';
  if (props.selectedFOSIds.length > 0) {
    buttonText = `${props.selectedFOSIds.length} fields`;
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

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (props.isActive) {
          props.dispatch(setActiveFilterButton(null));
        }
      }}
    >
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
        />
        <Popper open={props.isActive} anchorEl={anchorEl.current} placement="bottom-start" disablePortal>
          <div className={s.dropBoxWrapper}>
            <div className={s.FOSListWrapper}>{FOSList}</div>
            <div className={s.controlBtnsWrapper}>
              <button
                className={s.clearBtn}
                onClick={() => {
                  props.dispatch({
                    type: ACTION_TYPES.ARTICLE_SEARCH_CLEAR_FOS_FILTER,
                  });
                }}
              >
                Clear
              </button>
              <button
                className={s.applyBtn}
                onClick={() => {
                  trackSelectFilter('FOS', JSON.stringify(props.selectedFOSIds));
                  props.dispatch(setActiveFilterButton(null));
                  const link = makeNewFilterLink({ fos: props.selectedFOSIds }, props.location);
                  props.history.push(link);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
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
