import * as React from "react";
import { List } from "immutable";
import Tooltip from "../../../common/tooltip/tooltip";
import { IPaperAuthorRecord } from "../../../../model/paper";
const styles = require("./authors.scss");

export interface IAuthorsProps {
  authors: List<IPaperAuthorRecord>;
}

function getHIndexTooltip(hIndex: number) {
  if (!!hIndex) {
    return (
      <span className={styles.authorHIndex}>
        <Tooltip
          className={styles.authorHIndexTooltip}
          left={-37}
          top={-26}
          iconTop={-9}
          content={`h - index : ${hIndex}`}
          type="h-index"
        />
        {hIndex}
      </span>
    );
  }
}

function getAuthorOrganization(organization: string) {
  if (!!organization) {
    return `(${organization})`;
  }
}

const Authors = (props: IAuthorsProps) => {
  const authorItems = props.authors.map((author, index) => {
    return (
      <span className={styles.author} key={`author_${index}`}>
        {author.name}
        {getHIndexTooltip(author.hIndex)}
        {getAuthorOrganization(author.organization)}
        {index !== props.authors.size - 1 ? ", " : null}
      </span>
    );
  });

  return <span className={styles.authors}>{authorItems}</span>;
};

export default Authors;
