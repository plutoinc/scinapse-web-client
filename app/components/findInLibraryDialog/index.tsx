import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { AppState } from '../../reducers';
import { closeFindInLibraryDialog } from '../../reducers/findInLibraryDialog';
import { REQUEST_STEP } from './types';
import RequestForm, { RequestFormState } from './requestForm';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import PaperAPI from '../../api/paper';
import SuccessRequestContext from './successRequestContext';
import AlreadyRequestContext from './alreadyRequestContext';
import ActionTicketManager from '../../helpers/actionTicketManager';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./findInLibraryDialog.scss');

type FindInLibraryDialogProps = { paperId: string };

const FindInLibraryDialog: React.FC<FindInLibraryDialogProps> = ({ paperId }) => {
  useStyles(s);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);
  const [requestStep, setRequestStep] = React.useState(REQUEST_STEP.REQUEST_FORM);
  const [totalRequestCount, setTotalRequestCount] = React.useState(0);
  const [requestedAffiliation, setRequestedAffiliation] = React.useState('');
  const { isOpen, currentUser } = useSelector((appState: AppState) => ({
    isOpen: appState.findInLibraryDialogState.isOpen,
    currentUser: appState.currentUser,
  }));

  async function onSubmitForm(values: RequestFormState) {
    setIsLoading(true);

    try {
      let affiliationId: string | null = null;
      let affiliationName = '';
      if ((values.affiliation as Affiliation).name) {
        affiliationId = (values.affiliation as Affiliation).id;
        affiliationName = (values.affiliation as Affiliation).name;
      } else if ((values.affiliation as SuggestAffiliation).keyword) {
        affiliationId = (values.affiliation as SuggestAffiliation).affiliationId;
        affiliationName = (values.affiliation as SuggestAffiliation).keyword;
      }

      const res = await PaperAPI.requestLibraryLink({
        paperId,
        email: values.email,
        affiliationName,
        affiliationId,
      });

      if (res.alreadyRequested) {
        setRequestStep(REQUEST_STEP.ALREADY);
      } else {
        setRequestStep(REQUEST_STEP.SUCCESS);
      }

      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
        actionType: 'fire',
        actionArea: 'paperDescription',
        actionTag: 'sendRequestLibraryLink',
        actionLabel: String(paperId),
      });

      setTotalRequestCount(res.totalRequestCount);
      setRequestedAffiliation(res.affiliationName);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  function handleClose() {
    dispatch(closeFindInLibraryDialog());
    setRequestStep(REQUEST_STEP.REQUEST_FORM);
  }

  let mainSection = <RequestForm isLoading={isLoading} handleSubmit={onSubmitForm} currentUser={currentUser} />;

  switch (requestStep) {
    case REQUEST_STEP.SUCCESS:
      mainSection = <SuccessRequestContext count={totalRequestCount} affiliationName={requestedAffiliation} />;
      break;
    case REQUEST_STEP.ALREADY:
      mainSection = <AlreadyRequestContext count={totalRequestCount} affiliationName={requestedAffiliation} />;
      break;
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} classes={{ paper: s.dialogContainer }}>
      {mainSection}
      <div className={s.bottomBanner}>
        Request Paper is not available.<br />Please use the new request form{' '}
        <span className={s.highLightKeyword}>to ask your library.</span>
      </div>
    </Dialog>
  );
};

export default FindInLibraryDialog;
