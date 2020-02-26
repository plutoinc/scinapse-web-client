import React, { useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import Icon from '../../../../icons';
import DialogBody from '../paperImportDialogBody';
import { fetchProfileImportedPapers } from '../../../../actions/profile';
import alertToast from '../../../../helpers/makePlutoToastAction';
import { AppState } from '../../../../reducers';
import { closeImportPaperDialog, changeImportSourceTab } from '../../../../reducers/importPaperDialog';
import { IMPORT_SOURCE_TAB, CURRENT_IMPORT_PROGRESS_STEP, HandleImportPaperListParams } from '../../types';
import trackImportAction from './helpers/trackImportAction';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperImportDialog.scss');

interface HeaderItemProps { active: boolean; text: string; onClick: () => void; }
const HeaderItem: React.FC<HeaderItemProps> = ({ active, onClick, text }) => {
  return (
    <span
      onClick={onClick}
      className={classNames({ [`${s.tabItem}`]: true, [`${s.active}`]: active, })}
    >
      {text}
    </span>
  )
}

const Header: React.FC<{
  activeTab: IMPORT_SOURCE_TAB;
  onClickTab: (tab: IMPORT_SOURCE_TAB) => void;
}> = ({ activeTab, onClickTab }) => {
  return (
    <div className={s.tabBoxWrapper}>
      <div className={s.normalTabWrapper}>
        <HeaderItem
          text="BibTex"
          active={activeTab === IMPORT_SOURCE_TAB.BIBTEX}
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.BIBTEX)}
        />
        <HeaderItem
          text="Citation Text"
          active={activeTab === IMPORT_SOURCE_TAB.CITATION}
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.CITATION)}
        />
        <HeaderItem
          text="Google Scholar"
          active={activeTab === IMPORT_SOURCE_TAB.GS}
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.GS)}
        />
        <HeaderItem
          text="Author URL"
          active={activeTab === IMPORT_SOURCE_TAB.AUTHOR_URLS}
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.AUTHOR_URLS)}
        />
      </div>
    </div>
  );
};

const PaperImportDialog: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, activeTab, inProgressStep, profileSlug } = useSelector((appState: AppState) => ({
    isOpen: appState.importPaperDialogState.isOpen,
    activeTab: appState.importPaperDialogState.activeImportSourceTab,
    inProgressStep: appState.importPaperDialogState.inProgressStep,
    profileSlug: appState.importPaperDialogState.profileSlug,
  }));

  if (!profileSlug) return null;



  async function handleImportPaperList({ type, importedContext }: HandleImportPaperListParams) {
    try {
      setIsLoading(true);
      trackImportAction({ importSource: type, actionLabel: 'click' });
      await dispatch(fetchProfileImportedPapers(type, profileSlug!, importedContext));
      setIsLoading(false);
      trackImportAction({ importSource: type, actionLabel: 'success' });
    } catch (err) {
      alertToast({
        type: 'error',
        message: 'we had an error during importing papers. please refresh this page & try it again.',
      });
      trackImportAction({ importSource: type, actionLabel: 'failed' });
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => dispatch(closeImportPaperDialog())}
      classes={{
        paper: s.dialogPaper,
      }}
      maxWidth={'lg'}
    >
      <div className={s.boxContainer}>
        <div className={s.boxWrapper}>
          <div style={{ marginTop: 0 }} className={s.header}>
            <div className={s.title}>Import Publications</div>
            <Icon icon="X_BUTTON" className={s.iconWrapper} onClick={() => dispatch(closeImportPaperDialog())} />
          </div>
          {inProgressStep === CURRENT_IMPORT_PROGRESS_STEP.PROGRESS && (
            <Header
              activeTab={activeTab}
              onClickTab={(tab: IMPORT_SOURCE_TAB) => dispatch(changeImportSourceTab({ activeImportSourceTab: tab }))}
            />
          )}
          <DialogBody
            isLoading={isLoading}
            currentStep={inProgressStep}
            activeTab={activeTab}
            onSubmit={handleImportPaperList}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default PaperImportDialog;
