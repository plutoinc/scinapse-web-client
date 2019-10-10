import React from 'react';
import axios, { CancelTokenSource } from 'axios';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import { useDebouncedAsyncFetch } from '../../hooks/debouncedFetchAPIHook';
import CompletionAPI, { FOSSuggestion } from '../../api/completion';
import Icon from '../../icons';
import reducer, { FOSFilterInputInitialState } from './reducer';
import { handleInputKeydown } from '../common/InputWithSuggestionList/helpers/handleInputKeydown';
import { AggregationFos } from '../../model/aggregation';
import FOSItem from '../fosFilterDropdown/fosItem';
const s = require('./fosFilterInput.scss');

interface FOSFilterInputProps {
  forwardedRef: React.MutableRefObject<HTMLInputElement | null>;
  onSubmit: (FOSList: AggregationFos[]) => void;
}

const mapFOSSuggestionToAggregationFOS = (FOS: FOSSuggestion): AggregationFos => {
  return {
    id: FOS.fosId,
    name: FOS.keyword,
    docCount: 0,
    missingDocCount: true,
    level: 1,
  };
};

const FOSFilterInput: React.FC<FOSFilterInputProps> = props => {
  const cancelTokenSource = React.useRef<CancelTokenSource>(axios.CancelToken.source());
  const [state, dispatch] = React.useReducer(reducer, FOSFilterInputInitialState);

  const { data: FOSSuggestions, setParams: setKeyword } = useDebouncedAsyncFetch<string, FOSSuggestion[]>({
    initialParams: '',
    fetchFunc: async (q: string) => {
      const res = await CompletionAPI.fetchFOSSuggestion(q, cancelTokenSource.current.token);
      return res;
    },
    validateFunc: (query: string) => {
      if (!query || query.length < 2) throw new Error('keyword is too short');
    },
    wait: 200,
  });

  const handleSubmit = () => {
    if (!FOSSuggestions) {
      return dispatch({ type: 'CLOSE_BOX' });
    }

    const FOSList: AggregationFos[] = FOSSuggestions.filter(FOS => state.selectedFOSIds.includes(FOS.fosId)).map(
      mapFOSSuggestionToAggregationFOS
    );

    props.onSubmit(FOSList);

    dispatch({ type: 'CLOSE_BOX' });
  };

  const handleSelectItem = React.useCallback((FOSId: number) => {
    dispatch({
      type: 'TOGGLE_FOS',
      payload: {
        FOSId,
      },
    });
  }, []);

  React.useEffect(
    () => {
      setKeyword(state.genuineInputValue);
      return () => {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [state.genuineInputValue]
  );

  let FOSList = null;
  if (FOSSuggestions && FOSSuggestions.length > 0) {
    FOSList = FOSSuggestions.map((FOS, i) => {
      return (
        <FOSItem
          key={FOS.fosId}
          FOS={mapFOSSuggestionToAggregationFOS(FOS)}
          selected={state.selectedFOSIds.includes(FOS.fosId)}
          isHighlight={i === state.highlightIdx}
          onClick={handleSelectItem}
          isSearchResult
        />
      );
    });
  }
  const shouldShowList = state.isOpen && FOSList && FOSList.length > 0;

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (state.isOpen) {
          handleSubmit();
        }
      }}
    >
      <div className={classNames({ [s.wrapper]: true, [s.listOpened]: state.isOpen && !!FOSList })}>
        <div className={s.inputWrapper}>
          <Icon icon="SEARCH" className={s.searchIcon} />
          <input
            ref={props.forwardedRef}
            value={state.inputValue}
            onKeyDown={e => {
              if (FOSSuggestions && FOSSuggestions.length > 0) {
                handleInputKeydown<FOSSuggestion>({
                  e,
                  list: FOSSuggestions || [],
                  currentIdx: state.highlightIdx,
                  onMove: i => {
                    dispatch({
                      type: 'ARROW_KEYDOWN',
                      payload: {
                        targetIndex: i,
                        inputValue: FOSSuggestions[i] ? FOSSuggestions[i].keyword : state.genuineInputValue,
                      },
                    });
                  },
                  onSelect: i => {
                    if (i > -1 && FOSSuggestions[i]) {
                      handleSelectItem(FOSSuggestions[i].fosId);
                    }
                  },
                });
              }
            }}
            onFocus={() => {
              dispatch({ type: 'OPEN_BOX' });
            }}
            onChange={e => {
              const { value } = e.currentTarget;
              dispatch({ type: 'CHANGE_INPUT', payload: { inputValue: value } });
            }}
            placeholder="Search other topics"
            className={classNames({
              [s.input]: true,
              [s.listOpened]: shouldShowList,
            })}
          />
        </div>
        {shouldShowList && (
          <div className={s.listWrapper}>
            {FOSList}
            <div className={s.controlBtnsWrapper}>
              <button
                className={s.clearBtn}
                onClick={() => {
                  dispatch({ type: 'CLEAR' });
                }}
              >
                Clear
              </button>
              <button className={s.applyBtn} onClick={handleSubmit}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default withStyles<typeof FOSFilterInput>(s)(FOSFilterInput);
