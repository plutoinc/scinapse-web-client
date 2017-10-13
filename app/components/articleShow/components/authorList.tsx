import * as React from "react";
import { IAuthorRecord } from "../../../model/author";
import { List } from "immutable";
const styles = require("./authorList.scss");

export interface IAuthorListProps {
  authors: List<IAuthorRecord>;
}

function mapAuthItem(author: IAuthorRecord) {
  return (
    <span key={author.id} className={styles.authorItem}>
      <div className={styles.contentWrapper}>
        <div className={styles.authorName}>{author.name}</div>
        <div className={styles.authorOrganization}>{author.institution}</div>
      </div>
    </span>
  );
}

function getAuthItems(props: List<IAuthorRecord>) {
  return props.slice(0, 3).map(mapAuthItem);
}

function getMoreButton(props: List<IAuthorRecord>) {
  if (props.size > 3) {
    return <div className={styles.moreButton}>+ More</div>;
  } else {
    return null;
  }
}

const AuthorList = (props: IAuthorListProps) => {
  return (
    <div className={styles.authorListWrapper}>
      {getAuthItems(props.authors)}
      {getMoreButton(props.authors)}
    </div>
  );
};

export default AuthorList;
