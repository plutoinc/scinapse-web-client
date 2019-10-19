import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../reducers';
import { closeMobileSearchBox } from '../../../reducers/searchQuery';
import SearchQueryInput from '../InputWithSuggestionList/searchQueryInput';
import Button from '../button';
const useStyle = require('isomorphic-style-loader/useStyles');
const s = require('./mobileSearchBox.scss');

type Props = RouteComponentProps<any>;

const MobileSearchBox: React.FC<Props> = ({ location }) => {
  useStyle(s);
  const dispatch = useDispatch();
  const isOpen = useSelector<AppState, boolean>(state => state.searchQueryState.isOpenMobileBox);

  React.useEffect(
    () => {
      if (isOpen) dispatch(closeMobileSearchBox());
    },
    [location]
  );

  if (isOpen)
    return (
      <div
        className={s.mobileSearchBoxWrapper}
        onTouchStart={e => {
          const activeElement = document.activeElement;
          const relatedElement = e.target;
          if (activeElement === relatedElement) return console.log('testset');

          if (!!activeElement && activeElement.tagName === 'INPUT') {
            console.log(activeElement as HTMLElement);
            (activeElement as HTMLElement).blur();
          }
        }}
      >
        <SearchQueryInput
          maxCount={10}
          actionArea="topBar"
          autoFocus
          wrapperClassName={s.searchWrapper}
          inputClassName={s.searchInput}
        />
        <div className={s.mobileSearchBoxFooter}>
          <Button
            elementType="button"
            size="small"
            variant="text"
            color="gray"
            isLoading={false}
            onClick={() => dispatch(closeMobileSearchBox())}
          >
            <span>CANCEL</span>
          </Button>
        </div>
      </div>
    );

  return <div />;
};

export default withRouter(MobileSearchBox);
