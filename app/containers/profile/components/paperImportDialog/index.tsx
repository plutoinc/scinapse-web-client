import React, { useState } from 'react';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import Icon from '../../../../icons';
import profileAPI, { ImportedPaperListResponse } from '../../../../api/profile';
import GscImportForm, { GscFormState } from '../gscImportForm';
import BibTexImportForm, { BibTexFormState } from '../bibTexImportForm';
import ImportResultShow from '../importResultShow';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperImportDialog.scss');

enum IMPORT_SOURCE_TAB {
  GSC,
  BIBTEX,
}

enum CURRENT_STEP {
  PROGRESS,
  RESULT,
}

interface PaperImportDialogProps {
  isOpen: boolean;
  profileId: string;
  handleClosePaperImportDialog: () => void;
  fetchProfileShowData: () => void;
}

const Header: React.FC<{
  activeTab: IMPORT_SOURCE_TAB;
  onClickTab: (tab: IMPORT_SOURCE_TAB) => void;
}> = ({ activeTab, onClickTab }) => {
  return (
    <div className={s.tabBoxWrapper}>
      <div className={s.normalTabWrapper}>
        <span
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.GSC)}
          className={classNames({
            [`${s.tabItem}`]: true,
            [`${s.active}`]: activeTab === IMPORT_SOURCE_TAB.GSC,
          })}
        >
          Google Scholar
        </span>
        <span
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.BIBTEX)}
          className={classNames({
            [`${s.tabItem}`]: true,
            [`${s.active}`]: activeTab === IMPORT_SOURCE_TAB.BIBTEX,
          })}
        >
          BibTex
        </span>
      </div>
    </div>
  );
};

interface DialogBodyProps {
  isLoading: boolean;
  currentStep: CURRENT_STEP;
  activeTab: IMPORT_SOURCE_TAB;
  importResult: ImportedPaperListResponse | null;
  handleSubmitGS: (params: GscFormState) => void;
  handleSubmitBibTex: (params: BibTexFormState) => void;
}
const DialogBody: React.FC<DialogBodyProps> = ({
  handleSubmitGS,
  handleSubmitBibTex,
  currentStep,
  activeTab,
  importResult,
  isLoading,
}) => {
  if (currentStep === CURRENT_STEP.RESULT) return <ImportResultShow importResult={importResult} />;
  if (activeTab === IMPORT_SOURCE_TAB.GSC) return <GscImportForm isLoading={isLoading} onSubmitGS={handleSubmitGS} />;
  return <BibTexImportForm isLoading={isLoading} onSubmitBibtex={handleSubmitBibTex} />;
};

const PaperImportDialog: React.FC<PaperImportDialogProps> = ({
  isOpen,
  handleClosePaperImportDialog,
  profileId,
  fetchProfileShowData,
}) => {
  useStyles(s);

  const [inProgressStep, setInProgressStep] = useState<CURRENT_STEP>(CURRENT_STEP.PROGRESS);
  const [activeTab, setActiveTab] = useState<IMPORT_SOURCE_TAB>(IMPORT_SOURCE_TAB.GSC);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportedPaperListResponse | null>(null);

  const handleSubmitGS = (params: GscFormState) => {
    setIsLoading(true);
    profileAPI
      .importFromGSC({ profileId, url: params.url })
      .then(res => {
        fetchProfileShowData();
        setImportResult(res);
        setIsLoading(false);
        setInProgressStep(CURRENT_STEP.RESULT);
      })
      .catch(err => {
        console.error(err);
        alert('we had an error during importing papers. please refresh this page & try it again.');
        setIsLoading(false);
      });
  };

  const handleSubmitBibTex = (params: BibTexFormState) => {
    setIsLoading(true);
    console.log(params);
    setIsLoading(false);
    setInProgressStep(CURRENT_STEP.RESULT);
  };

  const onCloseDialog = () => {
    handleClosePaperImportDialog();
    setInProgressStep(CURRENT_STEP.PROGRESS);
    setActiveTab(IMPORT_SOURCE_TAB.GSC);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onCloseDialog}
      classes={{
        paper: s.dialogPaper,
      }}
      maxWidth={'lg'}
    >
      <div className={s.boxContainer}>
        <div className={s.boxWrapper}>
          <div style={{ marginTop: 0 }} className={s.header}>
            <div className={s.title}>Import Publications</div>
            <Icon icon="X_BUTTON" className={s.iconWrapper} onClick={onCloseDialog} />
          </div>
          {inProgressStep === CURRENT_STEP.PROGRESS && (
            <Header activeTab={activeTab} onClickTab={(tab: IMPORT_SOURCE_TAB) => setActiveTab(tab)} />
          )}
          <DialogBody
            handleSubmitGS={handleSubmitGS}
            handleSubmitBibTex={handleSubmitBibTex}
            isLoading={isLoading}
            currentStep={inProgressStep}
            importResult={importResult}
            activeTab={activeTab}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default PaperImportDialog;
