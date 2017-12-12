import * as React from "react";
const styles = require("./abstract.scss");

export interface IAbstractProps {
  abstract: string;
  isAbstractOpen: Boolean;
  toggleAbstract: () => void;
  searchQuery: string;
  isFirstOpen: Boolean;
  closeFirstOpen: () => void;
}

class Abstract extends React.Component<IAbstractProps, {}> {
  private restParagraphElementMaxHeight: number;
  private restParagraphElement: HTMLDivElement;

  public componentDidMount() {
    const { closeFirstOpen } = this.props;
    console.log(this.restParagraphElement);
    if (!!this.restParagraphElement) {
      this.restParagraphElementMaxHeight = this.restParagraphElement.clientHeight;
    }
    closeFirstOpen();
  }

  public render() {
    const { abstract, isAbstractOpen, toggleAbstract, isFirstOpen } = this.props;
    if (abstract === null) return null;
    // for removing first or last space
    const trimmedAbstract = abstract.replace(/^ /gi, "");

    const restParagraphStartIndex = trimmedAbstract.indexOf("\n");

    if (restParagraphStartIndex === -1) {
      return (
        <div className={styles.abstract}>
          <span>{trimmedAbstract}</span>
        </div>
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
          <span>{firstParagraph}</span>
          {!isAbstractOpen ? (
            <span className={styles.abstractToggleButton} onClick={toggleAbstract}>
              ...(More)
            </span>
          ) : null}
          <div
            className={styles.restParagraph}
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
            {restParagraph}
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
