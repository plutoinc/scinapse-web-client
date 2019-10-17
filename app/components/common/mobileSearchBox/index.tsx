import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../reducers';
import { closeMobileSearchBox } from '../../../reducers/searchQuery';
import SearchQueryInput from '../InputWithSuggestionList/searchQueryInput';
import { withRouter, RouteComponentProps } from 'react-router';
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
      <div className={s.mobileSearchBoxWrapper}>
        <SearchQueryInput
          maxCount={10}
          actionArea="topBar"
          autoFocus
          wrapperClassName={s.searchWrapper}
          inputClassName={s.searchInput}
        />
      </div>
    );

  return <div />;
};

export default withRouter(MobileSearchBox);
