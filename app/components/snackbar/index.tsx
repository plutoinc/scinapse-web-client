import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AppState } from '../../reducers';
import { GLOBAL_SNACKBAR_TYPE, closeSnackbar } from '../../reducers/scinapseSnackbar';
import CollectionSnackBar from './collectionSnackBar';
import CreateKeywordSnackBar from './createKeywordSnackBar';

type Props = RouteComponentProps<any>;

const Snackbar: React.FC<Props> = props => {
  const { location } = props;
  const dispatch = useDispatch();

  const { type, isOpen } = useSelector((appState: AppState) => ({
    type: appState.scinapseSnackbarState.type,
    isOpen: appState.scinapseSnackbarState.isOpen,
  }));

  useEffect(
    () => {
      if (isOpen) {
        dispatch(closeSnackbar());
      }
    },
    [dispatch, location]
  );

  switch (type) {
    case GLOBAL_SNACKBAR_TYPE.COLLECTION_SAVED:
      return <CollectionSnackBar />;
    case GLOBAL_SNACKBAR_TYPE.CREATE_KEYWORD_ALERT:
      return <CreateKeywordSnackBar />;
    default:
      return <div />;
  }
};

export default withRouter(Snackbar);
