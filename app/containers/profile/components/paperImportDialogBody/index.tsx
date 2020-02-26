import React from 'react';
import GSImportForm from '../gsImportForm';
import BibTexImportForm from '../bibTexImportForm';
import ImportResultShow from '../importResultShow';
import CitationStringImportForm from '../citationStringImportForm';
import AuthorUrlsImportForm from '../authorUrlsImportForm';
import { IMPORT_SOURCE_TAB, CURRENT_IMPORT_PROGRESS_STEP, HandleImportPaperListParams } from '../../types';

interface DialogBodyProps {
  isLoading: boolean;
  currentStep: CURRENT_IMPORT_PROGRESS_STEP;
  activeTab: IMPORT_SOURCE_TAB;
  onSubmit: (params: HandleImportPaperListParams) => void;
}

const DialogBody: React.FC<DialogBodyProps> = ({
  currentStep,
  activeTab,
  isLoading,
  onSubmit,
}) => {
  if (currentStep === CURRENT_IMPORT_PROGRESS_STEP.RESULT) return <ImportResultShow />;
  if (activeTab === IMPORT_SOURCE_TAB.GS) return <GSImportForm isLoading={isLoading} onSubmitGS={onSubmit} />;
  if (activeTab === IMPORT_SOURCE_TAB.CITATION) return <CitationStringImportForm isLoading={isLoading} onSubmitCitationString={onSubmit} />;
  if (activeTab === IMPORT_SOURCE_TAB.AUTHOR_URLS)
    return <AuthorUrlsImportForm isLoading={isLoading} onSubmitAuthorUrls={onSubmit} />;
  return <BibTexImportForm isLoading={isLoading} onSubmitBibtex={onSubmit} />;
};

export default DialogBody;
