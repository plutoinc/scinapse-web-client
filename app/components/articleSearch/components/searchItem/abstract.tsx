import * as React from "react";
const styles = require("./abstract.scss");

export interface IAbstractProps {
  abstract: string;
  isAbstractOpen: Boolean;
  toggleAbstract: () => void;
}

const Abstract = (props: IAbstractProps) => {
  if (props.abstract === null) return null;
  // for removing first or last space
  const trimmedAbstract = props.abstract.replace(/^ /gi, "");
  console.log(trimmedAbstract);
  const restParagraphStartIndex = trimmedAbstract.indexOf("\n");

  // if (props.isAbstractOpen) {
  //   this.restParagraphElementMaxHeight = this.restParagraphElementClientHeight;
  // } else {
  //   this.restParagraphElementMaxHeight = 0;
  // }

  if (restParagraphStartIndex === -1) {
    return (
      <div className={styles.abstract}>
        <span>{trimmedAbstract}</span>
      </div>
    );
  } else {
    const firstParagraph = trimmedAbstract.substring(0, restParagraphStartIndex);
    const restParagraph = trimmedAbstract.substring(restParagraphStartIndex);

    return (
      <div className={styles.abstract}>
        <span>{firstParagraph}</span>
        {!props.isAbstractOpen ? (
          <span className={styles.abstractToggleButton} onClick={props.toggleAbstract}>
            ...(More)
          </span>
        ) : null}
        <div
          className={styles.restParagraph}
          // style={
          //   !!this.restParagraphElementClientHeight
          //     ? {
          //         maxHeight: `${this.restParagraphElementMaxHeight}px`,
          //       }
          //     : null
          // }
          // ref={r => {
          //   this.restParagraphElement = r;
          // }}
        >
          {restParagraph}
          <span className={styles.abstractToggleButton} onClick={props.toggleAbstract}>
            (Less)
          </span>
        </div>
      </div>
    );
  }
};

export default Abstract;
