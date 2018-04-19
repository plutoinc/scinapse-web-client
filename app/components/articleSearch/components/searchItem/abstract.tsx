import * as React from "react";
import * as _ from "lodash";
import SearchQueryHighlightedContent from "../../../common/searchQueryHighlightedContent";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./abstract.scss");

export interface AbstractProps {
  abstract: string;
  isAbstractOpen: boolean;
  toggleAbstract: () => void;
  searchQueryText: string;
  isFirstOpen: boolean;
  closeFirstOpen: () => void;
}

@withStyles<typeof Abstract>(styles)
class Abstract extends React.Component<AbstractProps, {}> {
  private restParagraphElementMaxHeight: number;
  private restParagraphElement: HTMLDivElement;

  public shouldComponentUpdate(nextProps: AbstractProps) {
    if (
      this.props.abstract !== nextProps.abstract ||
      this.props.isAbstractOpen !== nextProps.isAbstractOpen ||
      this.props.searchQueryText !== nextProps.searchQueryText ||
      this.props.isFirstOpen !== nextProps.isFirstOpen
    ) {
      return true;
    } else {
      return false;
    }
  }

  public componentDidMount() {
    const { closeFirstOpen } = this.props;

    if (!!this.restParagraphElement) {
      this.restParagraphElementMaxHeight = this.restParagraphElement.clientHeight;
    }
    closeFirstOpen();
  }

  public render() {
    const { abstract, isAbstractOpen, toggleAbstract, isFirstOpen, searchQueryText } = this.props;

    if (!abstract) {
      return null;
    }

    const trimmedAbstract = abstract
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");

    const restParagraphStartIndex = trimmedAbstract.indexOf("\n");
    const isOnlyOneParagraph = restParagraphStartIndex === -1;
    const searchQuery = _.escapeRegExp(searchQueryText);

    if (isOnlyOneParagraph) {
      return (
        <SearchQueryHighlightedContent
          content={trimmedAbstract}
          searchQueryText={searchQuery}
          className={styles.abstract}
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
            <SearchQueryHighlightedContent content={firstParagraph} searchQueryText={searchQuery} />
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
            <SearchQueryHighlightedContent content={restParagraph} searchQueryText={searchQuery} />
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
