import React, { useState } from 'react';
import Icon from '../../../../icons';
import classNames from 'classnames';
import profileAPI, { PaperImportResType } from '../../../../api/profile';
import GscImportForm from '../gscImportForm';
import BibTexImportForm from '../bibTexImportForm';
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
  closePaperImportDialog: () => void;
  profileId: string;
}

interface GscFormState {
  url: string;
}

const PaperImportDialog: React.FC<PaperImportDialogProps> = ({ closePaperImportDialog, profileId }) => {
  useStyles(s);
  const [inProgressStep, setInProgressStep] = useState<InProgressStepType>(InProgressStepType.PROGRESS);
  const [activeTab, setActiveTab] = useState<AvailableImportType>(AvailableImportType.GSC);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<PaperImportResType | null>(null);

  const onGscSubmit = (params: GscFormState) => {
    setIsLoading(true);
    profileAPI.importFromGSC({ profileId, url: params.url }).then(res => {
      console.log(res);
      setImportResult(res);
      setIsLoading(false);
      setInProgressStep(InProgressStepType.RESULT);
    });
  };

  let dialogHeader: JSX.Element | null = (
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

  if (inProgressStep === InProgressStepType.RESULT) dialogHeader = null;

  function getMainSection(inProgressStep: InProgressStepType, currentTab: AvailableImportType) {
    if (inProgressStep === InProgressStepType.PROGRESS) {
      if (currentTab === AvailableImportType.GSC) {
        return <GscImportForm isLoading={isLoading} handleGscSubmit={onGscSubmit} />;
      } else {
        return (
          <BibTexImportForm
            isLoading={isLoading}
            handleBibTexSubmit={params => {
              console.log(params);
              setInProgressStep(InProgressStepType.RESULT);
            }}
          />
        );
      }
    } else {
      return <ImportResultShow importResult={importResult} />;
    }
  }

  return (
    <div className={s.boxContainer}>
      <div className={s.boxWrapper}>
        <div style={{ marginTop: 0 }} className={s.header}>
          <div className={s.title}>Import paper</div>
          <Icon icon="X_BUTTON" className={s.iconWrapper} onClick={closePaperImportDialog} />
        </div>
        {dialogHeader}
        {getMainSection(inProgressStep, activeTab)}
      </div>
    </div>
  );
};

export default PaperImportDialog;
