import React, { useState } from 'react';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import Icon from '../../../../icons';
import profileAPI, { PaperImportResType } from '../../../../api/profile';
import GscImportForm, { GscFormState } from '../gscImportForm';
import BibTexImportForm, { BibTexFormState } from '../bibTexImportForm';
import ImportResultShow from '../importResultShow';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperImportDialog.scss');

enum AvailableImportType {
  GSC,
  BibTex,
}

enum InProgressStepType {
  PROGRESS,
  RESULT,
}

interface PaperImportDialogProps {
  isOpen: boolean;
  closePaperImportDialog: () => void;
  profileId: string;
  fetchProfileShowData: () => void;
}

const PaperImportDialog: React.FC<PaperImportDialogProps> = ({
  isOpen,
  closePaperImportDialog,
  profileId,
  fetchProfileShowData,
}) => {
  useStyles(s);

  const [inProgressStep, setInProgressStep] = useState<InProgressStepType>(InProgressStepType.PROGRESS);
  const [activeTab, setActiveTab] = useState<AvailableImportType>(AvailableImportType.GSC);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<PaperImportResType | null>(null);

  const onGscSubmit = (params: GscFormState) => {
    setIsLoading(true);
    profileAPI.importFromGSC({ profileId, url: params.url }).then(res => {
      console.log(res);
      fetchProfileShowData();
      setImportResult(res);
      setIsLoading(false);
      setInProgressStep(InProgressStepType.RESULT);
    });
  };

  const onBibTexSubmit = (params: BibTexFormState) => {
    setIsLoading(true);
    console.log(params);
    setIsLoading(false);
    setInProgressStep(InProgressStepType.RESULT);
  };

  function getDialogBody(inProgressStep: InProgressStepType, currentTab: AvailableImportType) {
    let headerSection: JSX.Element | null = null;
    let mainSection: JSX.Element | null = null;
    if (inProgressStep === InProgressStepType.PROGRESS) {
      headerSection = (
        <div className={s.tabBoxWrapper}>
          <div className={s.normalTabWrapper}>
            <span
              onClick={() => {
                setActiveTab(AvailableImportType.GSC);
              }}
              className={classNames({
                [`${s.tabItem}`]: true,
                [`${s.active}`]: activeTab === AvailableImportType.GSC,
              })}
            >
              Google Scholar
            </span>
            <span
              onClick={() => {
                setActiveTab(AvailableImportType.BibTex);
              }}
              className={classNames({
                [`${s.tabItem}`]: true,
                [`${s.active}`]: activeTab === AvailableImportType.BibTex,
              })}
            >
              BibTex
            </span>
          </div>
        </div>
      );

      if (currentTab === AvailableImportType.GSC) {
        mainSection = <GscImportForm isLoading={isLoading} handleGscSubmit={onGscSubmit} />;
      } else {
        mainSection = <BibTexImportForm isLoading={isLoading} handleBibTexSubmit={onBibTexSubmit} />;
      }
    } else {
      headerSection = null;
      mainSection = <ImportResultShow importResult={importResult} />;
    }

    return (
      <>
        {headerSection}
        {mainSection}
      </>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={closePaperImportDialog}
      classes={{
        paper: s.dialogPaper,
      }}
      maxWidth={'lg'}
    >
      <div className={s.boxContainer}>
        <div className={s.boxWrapper}>
          <div style={{ marginTop: 0 }} className={s.header}>
            <div className={s.title}>Import paper</div>
            <Icon icon="X_BUTTON" className={s.iconWrapper} onClick={closePaperImportDialog} />
          </div>
          {getDialogBody(inProgressStep, activeTab)}
        </div>
      </div>
    </Dialog>
  );
};

export default PaperImportDialog;
