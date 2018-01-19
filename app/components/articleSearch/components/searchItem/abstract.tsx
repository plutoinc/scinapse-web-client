import * as React from "react";
import SearchQueryHighlightedContent from "../../../common/searchQueryHighlightedContent";
const styles = require("./abstract.scss");

export interface IAbstractProps {
  abstract: string;
  isAbstractOpen: boolean;
  toggleAbstract: () => void;
  searchQueryText: string;
  isFirstOpen: boolean;
  closeFirstOpen: () => void;
}

class Abstract extends React.Component<IAbstractProps, {}> {
  private restParagraphElementMaxHeight: number;
  private restParagraphElement: HTMLDivElement;

  public componentDidMount() {
    const { closeFirstOpen } = this.props;

    if (!!this.restParagraphElement) {
      this.restParagraphElementMaxHeight = this.restParagraphElement.clientHeight;
    }
    closeFirstOpen();
  }

  public render() {
    const { abstract, isAbstractOpen, toggleAbstract, isFirstOpen, searchQueryText } = this.props;
    if (!abstract) return null;
    // for removing first or last space or trash value of content
    const trimmedAbstract = abstract
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");

    const restParagraphStartIndex = trimmedAbstract.indexOf("\n");
    const isOnlyOneParagraph = restParagraphStartIndex === -1;

    if (isOnlyOneParagraph) {
      return (
        <SearchQueryHighlightedContent
          content={trimmedAbstract}
          searchQueryText={searchQueryText}
          nameForKey="abstract"
          className={styles.abstract}
          searchQueryClassName={styles.searchQuery}
        />
      );
    } else {
      const firstParagraph = trimmedAbstract.substring(0, restParagraphStartIndex);
      const restParagraph = trimmedAbstract.substring(restParagraphStartIndex);

      let restParagraphElementClientHeight;
      if (isAbstractOpen) {
        restParagraphElementClientHeight = this.restParagraphElementMaxHeight;
      } else {
        restParagraphElementClientHeight = 0;
      }

      return (
        <div className={styles.abstract}>
          <div className={styles.firstParagraph}>
            <SearchQueryHighlightedContent
              content={firstParagraph}
              searchQueryText={searchQueryText}
              nameForKey="abstract_firstParagraph"
              searchQueryClassName={styles.searchQuery}
            />
            {!isAbstractOpen ? (
              <span className={styles.abstractToggleButton} onClick={toggleAbstract}>
                ...(More)
              </span>
            ) : null}
          </div>
          <div
            className={isAbstractOpen ? `${styles.restParagraph} ${styles.isOpen}` : styles.restParagraph}
            style={
              !isFirstOpen
                ? {
                    maxHeight: `${restParagraphElementClientHeight}px`,
                  }
                : null
            }
            ref={r => {
              this.restParagraphElement = r;
            }}
          >
            <SearchQueryHighlightedContent
              content={restParagraph}
              searchQueryText={searchQueryText}
              nameForKey="abstract_restParagraph"
              searchQueryClassName={styles.searchQuery}
            />
            <span className={styles.abstractToggleButton} onClick={toggleAbstract}>
              (Less)
            </span>
          </div>
        </div>
      );
    }
  }
}

export default Abstract;
