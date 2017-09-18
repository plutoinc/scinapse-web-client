import * as React from "react";
const styles = require("./authorList.scss");

export interface IAuthorListProps {
  authors: any[]; // TODO: Change tag type after setting the API
}

function mapAuthItem(author: any, index: number) {
  // TODO: Change tag type after setting the API
  return (
    <span key={author.nickName + index} className={styles.authorItem}>
      <div className={styles.contentWrapper}>
        <div className={styles.authorName}>{author.nickName}</div>
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
