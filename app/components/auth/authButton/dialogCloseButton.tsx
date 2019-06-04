import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '../../../helpers/withStylesHelper';
import { closeDialog } from '../../dialog/actions';
import Icon from '../../../icons';
const styles = require('./authButton.scss');

interface DialogCloseButtonProps {
  dispatch: Dispatch<any>;
}

const DialogCloseButton: React.FunctionComponent<DialogCloseButtonProps> = props => {
  const { dispatch } = props;

  return (
    <button
      className={styles.dialogCloseButton}
      onClick={() => {
        dispatch(closeDialog());
      }}
    >
      <Icon icon="CLOSE_BUTTON" className={styles.dialogCloseIcon} />
    </button>
  );
};

export default connect()(withStyles<typeof DialogCloseButton>(styles)(DialogCloseButton));
