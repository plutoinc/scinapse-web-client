import * as React from "react";
import Dialog from "material-ui/Dialog";
import CitationBox, { CitationBoxProps } from "../../paperShow/components/citationBox";

export interface CitationDialogProps extends CitationBoxProps {
  isOpen: boolean;
}

export default class CitationDialog extends React.PureComponent<CitationDialogProps, {}> {
  public componentWillReceiveProps(nextProps: CitationDialogProps) {
    const { paperId, activeTab, handleClickCitationTab } = nextProps;

    if (paperId && this.props.paperId !== paperId) {
      handleClickCitationTab(activeTab, paperId);
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
