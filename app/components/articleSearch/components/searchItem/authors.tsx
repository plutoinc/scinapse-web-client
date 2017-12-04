import * as React from "react";
import { List } from "immutable";
import { IAuthorRecord } from "../../../../model/author";
import Tooltip from "../../../common/tooltip/tooltip";
const styles = require("./authors.scss");

export interface IAuthorsProps {
  authors: List<IAuthorRecord>;
}

const Authors = (props: IAuthorsProps) => {
  const authorItems = props.authors.map((author, index) => {
    return (
      <span className={styles.author} key={`author_${index}`}>
        {author.name}
        <span className={styles.authorHIndex}>
          <Tooltip
            className={styles.authorHIndexTooltip}
            left={-37}
            top={-26}
            iconTop={-9}
            content={`h - index : ${author.hIndex}`}
            type="h-index"
          />
          {author.hIndex}
        </span>
        {`(${author.institution})`}
        {index !== props.authors.size - 1 ? ", " : null}
      </span>
    );
  });

  return <span className={styles.authors}>{authorItems}</span>;
};

export default Authors;
