import React from 'react';
import GSImportForm, { GSFormState } from '../gsImportForm';
import BibTexImportForm, { BibTexFormState } from '../bibTexImportForm';
import ImportResultShow from '../importResultShow';
import CitationStringImportForm, { CitationStringFormState } from '../citationStringImportForm';
import AuthorUrlsImportForm, { AuthorUrlsFormState } from '../authorUrlsImportForm';
import { IMPORT_SOURCE_TAB, CURRENT_IMPORT_PROGRESS_STEP } from '../../types';

interface DialogBodyProps {
  isLoading: boolean;
  currentStep: CURRENT_IMPORT_PROGRESS_STEP;
  activeTab: IMPORT_SOURCE_TAB;
  onSubmitGS: (params: GSFormState) => void;
  onSubmitBibTex: (params: BibTexFormState) => void;
  onSubmitCitationString: (params: CitationStringFormState) => void;
  onSubmitAuthorUrls: (params: AuthorUrlsFormState) => void;
}

const DialogBody: React.FC<DialogBodyProps> = ({
  currentStep,
  activeTab,
  isLoading,
  onSubmitGS: handleSubmitGS,
  onSubmitBibTex: handleSubmitBibTex,
  onSubmitCitationString: handleSubmitCitationString,
  onSubmitAuthorUrls: handleSubmitAuthorUrls,
}) => {
  if (currentStep === CURRENT_IMPORT_PROGRESS_STEP.RESULT) return <ImportResultShow />;
  if (activeTab === IMPORT_SOURCE_TAB.GS) return <GSImportForm isLoading={isLoading} onSubmitGS={handleSubmitGS} />;
  if (activeTab === IMPORT_SOURCE_TAB.CITATION)
    return <CitationStringImportForm isLoading={isLoading} onSubmitCitationString={handleSubmitCitationString} />;
  if (activeTab === IMPORT_SOURCE_TAB.AUTHOR_URLS)
    return <AuthorUrlsImportForm isLoading={isLoading} onSubmitAuthorUrls={handleSubmitAuthorUrls} />;
  return <BibTexImportForm isLoading={isLoading} onSubmitBibtex={handleSubmitBibTex} />;
};

export default DialogBody;
