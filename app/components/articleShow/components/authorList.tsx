import * as React from "react";
import { IAuthor } from "../../../model/article";
const styles = require("./authorList.scss");

export interface IAuthorListProps {
  authors: IAuthor[];
}

function mapAuthItem(author: any, index: number) {
  return (
    <span key={author.name + index} className={styles.authorItem}>
      <div className={styles.contentWrapper}>
        <div className={styles.authorName}>{author.name}</div>
        <div className={styles.authorOrganization}>{author.organization}</div>
      </div>
    </span>
  );
}

function getAuthItems(props: IAuthorListProps) {
  return props.authors.slice(0, 3).map(mapAuthItem);
}

function getMoreButton(props: IAuthorListProps) {
  if (props.authors.length > 3) {
    return <div className={styles.moreButton}>+ More</div>;
  } else {
    return null;
  }
}

const AuthorList = (props: IAuthorListProps) => {
  return (
    <div className={styles.authorListWrapper}>
      {getAuthItems(props)}
      {getMoreButton(props)}
    </div>
  );
};

export default AuthorList;
