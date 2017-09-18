import * as React from "react";
const styles = require("./articleInfo.scss");

export interface IArticleInfoProps {
  from: string;
  createdAt: string;
  user: any; // TODO: Change tag type after setting the API
}

const ArticleInfo = (props: IArticleInfoProps) => {
  return (
    <div className={styles.articleInfoWrapper}>
      <span className={styles.articleInfoItem}>from {props.from}</span>
      <span className={styles.articleInfoItem}>by {props.user.nickName}</span>
      <span className={styles.articleInfoItem}>posted at {props.createdAt}</span>
    </div>
  );
};

export default ArticleInfo;
