import * as React from "react";
const styles = require("./title.scss");

export interface ITitleProps {
  title: string;
  searchQuery: string;
}

const Title = (props: ITitleProps) => {
  if (!props.searchQuery) {
    return <div className={styles.title}>{props.title}</div>;
  } else {
    let currentIndex = 0;
    let parsingIndex = 0;
    let indexArray: number[] = [0];

    while (parsingIndex !== -1) {
      parsingIndex = props.title.slice(currentIndex, props.title.length - 1).indexOf(props.searchQuery);
      if (parsingIndex !== -1) {
        indexArray.push(currentIndex + parsingIndex);
        indexArray.push(currentIndex + parsingIndex + props.searchQuery.length);
        currentIndex = currentIndex + parsingIndex + props.searchQuery.length;
      }
    }

    const titleContent = indexArray.map((val: number, index: number, array: number[]) => {
      let nextVal;
      if (index + 1 <= array.length) {
        nextVal = array[index + 1];
      } else {
        nextVal = props.title.length - 1;
      }

      if (index % 2 === 0) {
        return <span key={`title_${index}`}>{props.title.slice(val, nextVal)}</span>;
      } else {
        return (
          <span key={`title_${index}`} className={styles.searchQuery}>
            {props.title.slice(val, val + props.searchQuery.length)}
          </span>
        );
      }
    });

    return <div className={styles.title}>{titleContent}</div>;
  }
};

export default Title;
