import * as React from "react";
import SearchQueryContent from "../../../common/searchQueryContent";
const styles = require("./abstract.scss");

export interface IAbstractProps {
  abstract: string;
  isAbstractOpen: boolean;
  toggleAbstract: () => void;
  searchQuery: string;
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
    const { abstract, isAbstractOpen, toggleAbstract, isFirstOpen, searchQuery } = this.props;
    if (!abstract) return null;
    // for removing first or last space
    const trimmedAbstract = abstract.replace(/^ /gi, "");

    const restParagraphStartIndex = trimmedAbstract.indexOf("\n");

    if (restParagraphStartIndex === -1) {
      return (
        <SearchQueryContent
          content={trimmedAbstract}
          searchQuery={searchQuery}
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
            <SearchQueryContent
              content={firstParagraph}
              searchQuery={searchQuery}
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
            <SearchQueryContent
              content={restParagraph}
              searchQuery={searchQuery}
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
