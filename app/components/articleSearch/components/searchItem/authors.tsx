import * as React from "react";
import { List } from "immutable";
import Tooltip from "../../../common/tooltip/tooltip";
import { IPaperAuthorRecord } from "../../../../model/paper";
const styles = require("./authors.scss");

export interface IAuthorsProps {
  authors: List<IPaperAuthorRecord>;
  isAuthorsOpen: boolean;
  toggleAuthors: () => void;
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
  if (props.authors.size <= 3) {
    const authorItems = props.authors.map((author, index) => {
      return (
        <span className={styles.author} key={`author_${index}`}>
          <span className={styles.authorName}>{`${author.name} `}</span>
          {getHIndexTooltip(author.hIndex)}
          {getAuthorOrganization(author.organization)}
          {index !== props.authors.size - 1 ? <span className={styles.authorName}>{`, `}</span> : null}
        </span>
      );
    });

    return <span className={styles.authors}>{authorItems}</span>;
  } else if (!props.isAuthorsOpen) {
    const authorItems = props.authors.slice(0, 3).map((author, index) => {
      return (
        <span className={styles.author} key={`author_${index}`}>
          <span className={styles.authorName}>{`${author.name} `}</span>
          {getHIndexTooltip(author.hIndex)}
          {getAuthorOrganization(author.organization)}
          {index !== 2 ? <span className={styles.authorName}>{`, `}</span> : null}
        </span>
      );
    });

    return (
      <span className={styles.authors}>
        {authorItems}
        <span className={styles.toggleAuthorsButton} onClick={props.toggleAuthors}>
          {` ... (${props.authors.size - 3} others)`}
        </span>
      </span>
    );
  } else {
    const authorItems = props.authors.map((author, index) => {
      return (
        <span className={styles.author} key={`author_${index}`}>
          <span className={styles.authorName}>{`${author.name} `}</span>
          {getHIndexTooltip(author.hIndex)}
          {getAuthorOrganization(author.organization)}
          {index !== props.authors.size - 1 ? <span className={styles.authorName}>{`, `}</span> : null}
        </span>
      );
    });

    return (
      <span className={styles.authors}>
        {authorItems}
        <span className={styles.toggleAuthorsButton} onClick={props.toggleAuthors}>
          {` ... (less)`}
        </span>
      </span>
    );
  }
};

export default Authors;
