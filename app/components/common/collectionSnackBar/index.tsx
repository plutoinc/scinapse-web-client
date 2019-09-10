import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { AppState } from '../../../reducers';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { closeCollectionSnackBar } from '../../../reducers/collectionSnackBar';
import { closeDialog } from '../../dialog/actions';
import Icon from '../../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./collectionSnackBar.scss');
type Props = ReturnType<typeof mapStateToProps>;

const CollectionSnackBar: React.FC<Props> = props => {
  useStyles(s);
  const dispatch = useDispatch();
  const { collectionSnackBarState } = props;
  return (
    <Snackbar
      classes={{ root: s.snackbarWrapper }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={collectionSnackBarState.isOpen}
      onClose={() => dispatch(closeCollectionSnackBar())}
      autoHideDuration={6000}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={
        <span id="message-id" className={s.snackbarContext}>
          The paper has been saved to {collectionSnackBarState.collectionName}.
        </span>
      }
      action={[
        <Link
          className={s.goToCollectionBtn}
          key={`goToCollection`}
          to={`/collections/${collectionSnackBarState.collectionId}`}
          onClick={() => {
            dispatch(closeCollectionSnackBar());
            dispatch(closeDialog());
          }}
        >
          Go to Collection
        </Link>,
        <button className={s.closeBtn} key={`close`} onClick={() => dispatch(closeCollectionSnackBar())}>
          <Icon icon="X_BUTTON" />
        </button>,
      ]}
    />
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    collectionSnackBarState: state.collectionSnackBarState,
  };
};

export default connect(mapStateToProps)(CollectionSnackBar);
