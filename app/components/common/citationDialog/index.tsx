import * as React from "react";
import Dialog from "material-ui/Dialog";
import CitationBox, { CitationBoxProps } from "../../paperShow/components/citationBox";
import { AvailableCitationType } from "../../paperShow/records";

export interface CitationDialogProps extends CitationBoxProps {
  isOpen: boolean;
}

export default class CitationDialog extends React.PureComponent<CitationDialogProps, {}> {
  public componentWillReceiveProps(nextProps: CitationDialogProps) {
    const { paperId, isOpen, activeTab, isLoading, handleClickCitationTab } = nextProps;

    const isFirstOpen =
      !!paperId && (!this.props.isOpen && isOpen) && activeTab === AvailableCitationType.BIBTEX && !isLoading;

    if (isFirstOpen) {
      handleClickCitationTab(AvailableCitationType.BIBTEX, paperId);
    }
  }

  public render() {
    const {
      isOpen,
      paperId,
      toggleCitationDialog,
      isFullFeature,
      activeTab,
      isLoading,
      citationText,
      handleClickCitationTab,
      setActiveCitationDialogPaperId,
    } = this.props;

    return (
      <Dialog onRequestClose={toggleCitationDialog} open={isOpen}>
        <CitationBox
          paperId={paperId}
          setActiveCitationDialogPaperId={setActiveCitationDialogPaperId}
          toggleCitationDialog={toggleCitationDialog}
          isFullFeature={isFullFeature}
          activeTab={activeTab}
          isLoading={isLoading}
          citationText={citationText}
          handleClickCitationTab={handleClickCitationTab}
        />
      </Dialog>
    );
  }
}
