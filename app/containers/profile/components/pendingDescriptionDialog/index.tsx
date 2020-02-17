import React, { FC } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./pendingDescriptionDialog.scss');

const PendingDescriptionDialog: FC<DialogProps> = props => {
  useStyles(s);

  return (
    <Dialog {...props}>
      <Icon icon="X_BUTTON" className={s.iconWrapper} onClick={props.onClose} />
      <DialogTitle>What are pending publications?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>Pending publications are papers that are not yet verified as your paper.</p>
          <p>In other words, we help match the author to the paper.</p>
          <p>
            The pending publications are suggestions that it might be one of the papers you wrote, but are not confirmed
            due to differences in the way the names are registered on the paper, affiliation, or just some minor
            technical glitches.
          </p>
          <p>
            Pending papers also include ones that we could not match the list you uploaded via Google Scholar profile
            page, BibTex, or just plain text with our expansive bibliographic database.
          </p>
          <p>We update our database daily but newly published papers can take some time to be added in our database.</p>
          <p>We will notify you in case we locate a publication that you may have published.</p>
        </DialogContentText>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="large" elementType="button" aria-label="Okay button" onClick={props.onClose}>
            <span>Okay</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingDescriptionDialog;
