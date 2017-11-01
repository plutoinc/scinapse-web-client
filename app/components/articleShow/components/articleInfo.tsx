import * as React from "react";
import { Link } from "react-router-dom";
import { IMemberRecord } from "../../../model/member";
const styles = require("./articleInfo.scss");

export interface IArticleInfoProps {
  from: string;
  createdAt: string;
  createdBy: IMemberRecord;
}
function getArticleFrom(props: IArticleInfoProps) {
  if (props.from) {
    return <span className={styles.articleInfoItem}>from {props.from}</span>;
  }
}
const ArticleInfo = (props: IArticleInfoProps) => {
  return (
    <div className={styles.articleInfoWrapper}>
      {getArticleFrom(props)}
      <span className={styles.articleInfoItem}>
        posted by <Link to={`/users/${props.createdBy.id}`}>{props.createdBy.name}</Link>
      </span>
      <span className={styles.articleInfoItem}>posted at {props.createdAt}</span>
    </div>
  );
};

export default ArticleInfo;
