import React from 'react';
import { CURRENT_STEP, IMPORT_SOURCE_TAB } from '../paperImportDialog';
import { ImportedPaperListResponse } from '../../../../api/profile';
import GSImportForm, { GSFormState } from '../gsImportForm';
import BibTexImportForm, { BibTexFormState } from '../bibTexImportForm';
import ImportResultShow from '../importResultShow';
import CitationStringImportForm, { CitationStringFormState } from '../citationStringImportForm';

interface DialogBodyProps {
  isLoading: boolean;
  currentStep: CURRENT_STEP;
  activeTab: IMPORT_SOURCE_TAB;
  importResult: ImportedPaperListResponse | null;
  handleSubmitGS: (params: GSFormState) => void;
  handleSubmitBibTex: (params: BibTexFormState) => void;
  handleSubmitCitationString: (params: CitationStringFormState) => void;
}

const DialogBody: React.FC<DialogBodyProps> = ({
  currentStep,
  activeTab,
  importResult,
  isLoading,
  handleSubmitGS,
  handleSubmitBibTex,
  handleSubmitCitationString,
}) => {
  if (currentStep === CURRENT_STEP.RESULT) return <ImportResultShow importResult={importResult} />;
  if (activeTab === IMPORT_SOURCE_TAB.GS) return <GSImportForm isLoading={isLoading} onSubmitGS={handleSubmitGS} />;
  if (activeTab === IMPORT_SOURCE_TAB.CITATION)
    return <CitationStringImportForm isLoading={isLoading} onSubmitCitationString={handleSubmitCitationString} />;
  return <BibTexImportForm isLoading={isLoading} onSubmitBibtex={handleSubmitBibTex} />;
};

export default DialogBody;
