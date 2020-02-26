import React, { useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import Icon from '../../../../icons';
import { GSFormState } from '../gsImportForm';
import { BibTexFormState } from '../bibTexImportForm';
import { CitationStringFormState } from '../citationStringImportForm';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import DialogBody from '../paperImportDialogBody';
import { fetchProfileImportedPapers } from '../../../../actions/profile';
import alertToast from '../../../../helpers/makePlutoToastAction';
import { AuthorUrlsFormState, SCINAPSE_AUTHOR_SHOW_PREFIX } from '../authorUrlsImportForm';
import { AppState } from '../../../../reducers';
import { closeImportPaperDialog, changeImportSourceTab } from '../../../../reducers/importPaperDialog';
import { IMPORT_SOURCE_TAB, CURRENT_IMPORT_PROGRESS_STEP } from '../../types';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperImportDialog.scss');

const Header: React.FC<{
  activeTab: IMPORT_SOURCE_TAB;
  onClickTab: (tab: IMPORT_SOURCE_TAB) => void;
}> = ({ activeTab, onClickTab }) => {
  return (
    <div className={s.tabBoxWrapper}>
      <div className={s.normalTabWrapper}>
        <span
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.BIBTEX)}
          className={classNames({
            [`${s.tabItem}`]: true,
            [`${s.active}`]: activeTab === IMPORT_SOURCE_TAB.BIBTEX,
          })}
        >
          BibTex
        </span>
        <span
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.CITATION)}
          className={classNames({
            [`${s.tabItem}`]: true,
            [`${s.active}`]: activeTab === IMPORT_SOURCE_TAB.CITATION,
          })}
        >
          Citation Text
        </span>
        <span
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.GS)}
          className={classNames({
            [`${s.tabItem}`]: true,
            [`${s.active}`]: activeTab === IMPORT_SOURCE_TAB.GS,
          })}
        >
          Google Scholar
        </span>
        <span
          onClick={() => onClickTab(IMPORT_SOURCE_TAB.AUTHOR_URLS)}
          className={classNames({
            [`${s.tabItem}`]: true,
            [`${s.active}`]: activeTab === IMPORT_SOURCE_TAB.AUTHOR_URLS,
          })}
        >
          Author URL
        </span>
      </div>
    </div>
  );
};

function trackImportFromGS(actionLabel: string) {
  ActionTicketManager.trackTicket({
    pageType: 'profileShow',
    actionType: 'fire',
    actionArea: 'paperImportFromGSDialog',
    actionTag: 'clickSubmitGSBtn',
    actionLabel: actionLabel,
  });
}

function trackImportFromBibtex(actionLabel: string) {
  ActionTicketManager.trackTicket({
    pageType: 'profileShow',
    actionType: 'fire',
    actionArea: 'paperImportFromBibtexDialog',
    actionTag: 'clickSubmitBibtexBtn',
    actionLabel: actionLabel,
  });
}

function trackImportFromCitationString(actionLabel: string) {
  ActionTicketManager.trackTicket({
    pageType: 'profileShow',
    actionType: 'fire',
    actionArea: 'paperImportFromCitationStringDialog',
    actionTag: 'clickSubmitCitationStringBtn',
    actionLabel: actionLabel,
  });
}

function trackImportFromAuthorUrls(actionLabel: string) {
  ActionTicketManager.trackTicket({
    pageType: 'profileShow',
    actionType: 'fire',
    actionArea: 'paperImportFromAuthorUrlsDialog',
    actionTag: 'clickSubmitAuthorUrlsBtn',
    actionLabel: actionLabel,
  });
}

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

  const handleSubmitGS = async (params: GSFormState) => {
    setIsLoading(true);

    trackImportFromGS('clickSubmitGSBtn');

    try {
      await dispatch(fetchProfileImportedPapers(IMPORT_SOURCE_TAB.GS, profileSlug, params.url));
      setIsLoading(false);

      trackImportFromGS('successSubmitGS');
    } catch (err) {
      setIsLoading(false);
      trackImportFromGS('failureSubmitGS');
      alertToast({
        type: 'error',
        message: 'we had an error during importing papers. please refresh this page & try it again.',
      });
    }
  };

  const handleSubmitBibTex = async (params: BibTexFormState) => {
    setIsLoading(true);
    trackImportFromBibtex('clickSubmitBibtexBtn');
    try {
      await dispatch(fetchProfileImportedPapers(IMPORT_SOURCE_TAB.BIBTEX, profileSlug, params.bibTexString));
      setIsLoading(false);

      trackImportFromBibtex('successSubmitBibtex');
    } catch (err) {
      setIsLoading(false);
      trackImportFromBibtex('failureSubmitBibtex');
      alertToast({
        type: 'error',
        message: 'we had an error during importing papers. please refresh this page & try it again.',
      });
    }
  };

  const handleSubmitCitationString = async (params: CitationStringFormState) => {
    setIsLoading(true);
    trackImportFromCitationString('clickSubmitCitationStringBtn');
    try {
      await dispatch(fetchProfileImportedPapers(IMPORT_SOURCE_TAB.BIBTEX, profileSlug, params.citationString));
      setIsLoading(false);

      trackImportFromCitationString('successSubmitCitationString');
    } catch (err) {
      setIsLoading(false);
      trackImportFromCitationString('failureSubmitCitationString');

      alertToast({
        type: 'error',
        message: 'we had an error during importing papers. please refresh this page & try it again.',
      });
    }
  };

  const handleSubmitAuthorUrls = async (params: AuthorUrlsFormState) => {
    setIsLoading(true);
    trackImportFromAuthorUrls('clickSubmitAuthorUrlsBtn');
    try {
      const authorIds = params.authorUrls.map(authorUrl => {
        return authorUrl.split(SCINAPSE_AUTHOR_SHOW_PREFIX)[1];
      });

      await dispatch(fetchProfileImportedPapers(IMPORT_SOURCE_TAB.AUTHOR_URLS, profileSlug, authorIds));
      setIsLoading(false);

      trackImportFromAuthorUrls('successSubmitAuthorUrls');
    } catch (err) {
      setIsLoading(false);
      trackImportFromAuthorUrls('failureSubmitAuthorUrls');

      alertToast({
        type: 'error',
        message: 'we had an error during importing papers. please refresh this page & try it again.',
      });
    }
  };

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
            handleSubmitGS={handleSubmitGS}
            handleSubmitBibTex={handleSubmitBibTex}
            handleSubmitCitationString={handleSubmitCitationString}
            handleSubmitAuthorUrls={handleSubmitAuthorUrls}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default PaperImportDialog;
