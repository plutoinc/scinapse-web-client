import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../reducers';
import { closeMobileSearchBox } from '../../../reducers/searchQuery';
import SearchQueryInput from '../InputWithSuggestionList/searchQueryInput';
import Button from '../button';
import { UserDevice } from '../../layouts/reducer';
const useStyle = require('isomorphic-style-loader/useStyles');
const s = require('./mobileSearchBox.scss');

type Props = RouteComponentProps<any>;

const MobileSearchBox: React.FC<Props> = ({ location }) => {
  useStyle(s);
  const dispatch = useDispatch();
  const isOpen = useSelector<AppState, boolean>(state => state.searchQueryState.isOpenMobileBox);
  const isMobile = useSelector<AppState, boolean>((state: AppState) => state.layout.userDevice === UserDevice.MOBILE);

  React.useEffect(
    () => {
      if (isOpen) dispatch(closeMobileSearchBox());
    },
    [location]
  );

  if (!isMobile || !isOpen) return null;

  return (
    <div
      className={s.mobileSearchBoxWrapper}
      onTouchStart={e => {
        const activeElement = document.activeElement;
        const relatedElement = e.target;
        if (activeElement === relatedElement) return;

        if (!!activeElement && activeElement.tagName === 'INPUT') {
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
};

export default withRouter(MobileSearchBox);
