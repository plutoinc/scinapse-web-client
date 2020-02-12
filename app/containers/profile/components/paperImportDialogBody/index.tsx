import React from 'react';
import GSImportForm, { GSFormState } from '../gsImportForm';
import BibTexImportForm, { BibTexFormState } from '../bibTexImportForm';
import ImportResultShow from '../importResultShow';
import CitationStringImportForm, { CitationStringFormState } from '../citationStringImportForm';

export enum IMPORT_SOURCE_TAB {
  GS,
  BIBTEX,
  CITATION,
}

export enum CURRENT_STEP {
  PROGRESS,
  RESULT,
}

interface DialogBodyProps {
  isLoading: boolean;
  currentStep: CURRENT_STEP;
  activeTab: IMPORT_SOURCE_TAB;
  handleSubmitGS: (params: GSFormState) => void;
  handleSubmitBibTex: (params: BibTexFormState) => void;
  handleSubmitCitationString: (params: CitationStringFormState) => void;
}

const DialogBody: React.FC<DialogBodyProps> = ({
  currentStep,
  activeTab,
  isLoading,
  handleSubmitGS,
  handleSubmitBibTex,
  handleSubmitCitationString,
}) => {
  if (currentStep === CURRENT_STEP.RESULT) return <ImportResultShow />;
  if (activeTab === IMPORT_SOURCE_TAB.GS) return <GSImportForm isLoading={isLoading} onSubmitGS={handleSubmitGS} />;
  if (activeTab === IMPORT_SOURCE_TAB.CITATION)
    return <CitationStringImportForm isLoading={isLoading} onSubmitCitationString={handleSubmitCitationString} />;
  return <BibTexImportForm isLoading={isLoading} onSubmitBibtex={handleSubmitBibTex} />;
};

export default DialogBody;
