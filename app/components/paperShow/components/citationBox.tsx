import * as React from "react";

export enum CitationBoxTab {
  BIBTEX,
  MLA,
  APA,
  // ENDNOTE // TODO: Add EndNote format
}

interface CitationBoxProps {
  activeTab: CitationBoxTab;
  isLoading: boolean;
  citationText: string;
}

class CitationBox extends React.PureComponent<CitationBoxProps, {}> {
  public render() {
    return (
      <div>
        Hello World
        <div>Hello</div>
      </div>
    );
  }
}

export default CitationBox;
