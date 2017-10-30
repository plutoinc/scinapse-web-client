import * as React from "react";
import { IMemberRecord } from "../../../model/member";
import { Link } from "react-router-dom";
const styles = require("./articleInfo.scss");

export interface IArticleInfoProps {
  from: string;
  createdAt: string;
  createdBy: IMemberRecord;
}

const ArticleInfo = (props: IArticleInfoProps) => {
  return (
    <div className={styles.articleInfoWrapper}>
      <span className={styles.articleInfoItem}>from {props.from}</span>
      <span className={styles.articleInfoItem}>
        posted by <Link to={`/users/${props.createdBy.id}`}>{props.createdBy.name}</Link>
      </span>
      <span className={styles.articleInfoItem}>posted at {props.createdAt}</span>
    </div>
  );
};

export default ArticleInfo;
