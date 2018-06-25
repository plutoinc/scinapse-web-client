import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import CitationBox, {
  CitationBoxProps
} from "../../paperShow/components/citationBox";

export interface CitationDialogProps extends CitationBoxProps {
  isOpen: boolean;
  toggleCitationDialog: () => void;
}

export default class CitationDialog extends React.PureComponent<
  CitationDialogProps,
  {}
> {
  public componentDidMount() {
    const { paperId, activeTab, handleClickCitationTab } = this.props;
    handleClickCitationTab(activeTab, paperId);
  }

  public render() {
    const {
      isOpen,
      paperId,
      toggleCitationDialog,
      activeTab,
      isLoading,
      citationText,
      handleClickCitationTab,
      setActiveCitationDialogPaperId
    } = this.props;

    return (
      <Dialog onClose={toggleCitationDialog} open={isOpen}>
        <CitationBox
          paperId={paperId}
          setActiveCitationDialogPaperId={setActiveCitationDialogPaperId}
          activeTab={activeTab}
          isLoading={isLoading}
          citationText={citationText}
          handleClickCitationTab={handleClickCitationTab}
        />
      </Dialog>
    );
  }
}
