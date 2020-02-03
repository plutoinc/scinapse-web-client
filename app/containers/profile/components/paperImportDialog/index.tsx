import React, { useState } from 'react';
import Icon from '../../../../icons';
import classNames from 'classnames';
import profileAPI from '../../../../api/profile';
import GscImportForm from '../gscImportForm';
import BibTexImportForm from '../bibTexImportForm';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperImportDialog.scss');

enum AvailableImportType {
  GSC,
  BibTex,
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
  const [activeTab, setActiveTab] = useState<AvailableImportType>(AvailableImportType.GSC);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onGscSubmit = (params: GscFormState) => {
    setIsLoading(true);
    profileAPI.importFromGSC({ profileId, url: params.url }).then(res => {
      console.log(res);
      setIsLoading(false);
    });
  };

  return (
    <div className={s.boxContainer}>
      <div className={s.boxWrapper}>
        <div style={{ marginTop: 0 }} className={s.header}>
          <div className={s.title}>Cite</div>
          <Icon icon="X_BUTTON" className={s.iconWrapper} onClick={closePaperImportDialog} />
        </div>
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
        {activeTab === AvailableImportType.GSC ? (
          <GscImportForm isLoading={isLoading} handleGscSubmit={onGscSubmit} />
        ) : (
          <BibTexImportForm
            isLoading={isLoading}
            handleBibTexSubmit={params => {
              console.log(params);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PaperImportDialog;
