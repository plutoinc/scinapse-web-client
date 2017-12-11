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
    //TODO: Add Algorithm for expressing bold query
    return <div className={styles.title}>{props.title}</div>;
  }
};

export default Title;
