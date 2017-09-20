import * as React from "react";
import { IMember } from "../../../model/article";
const styles = require("./articleInfo.scss");

export interface IArticleInfoProps {
  from: string;
  createdAt: string;
  createdBy: IMember;
}

const ArticleInfo = (props: IArticleInfoProps) => {
  return (
    <div className={styles.articleInfoWrapper}>
      <span className={styles.articleInfoItem}>from {props.from}</span>
      <span className={styles.articleInfoItem}>by {props.createdBy.fullName}</span>
      <span className={styles.articleInfoItem}>posted at {props.createdAt}</span>
    </div>
  );
};

export default ArticleInfo;
