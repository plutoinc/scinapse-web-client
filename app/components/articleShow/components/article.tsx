import * as React from "react";
const styles = require("./article.scss");

export interface IArticleProps {
  link: string;
}

const Article = (props: IArticleProps) => {
  return (
    <div className={styles.articleWrapper}>
      <div className={styles.title}>Article</div>
      <a target="_blank" href={props.link} className={styles.articleButton}>
        Go to read the article
      </a>
    </div>
  );
};

export default Article;
