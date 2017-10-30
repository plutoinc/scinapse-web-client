import * as React from "react";
import Icon from "../../../icons";
const styles = require("./article.scss");

export interface IArticleProps {
  link: string;
}

const Article = (props: IArticleProps) => {
  return (
    <div className={styles.articleWrapper}>
      <div className={styles.title}>Article</div>
      <a target="_blank" href={props.link} className={styles.articleButton}>
        <Icon className={styles.articleButtonIcon} icon="EXTERNAL_SHARE" />
        <span>Go to read the article</span>
      </a>
    </div>
  );
};

export default Article;
