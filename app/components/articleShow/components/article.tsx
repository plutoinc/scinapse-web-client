import * as React from "react";
import Icon from "../../../icons";
import { trackAndOpenLink } from "../../../helpers/handleGA";
const styles = require("./article.scss");

export interface IArticleProps {
  link: string;
}

const Article = (props: IArticleProps) => {
  return (
    <div className={styles.articleWrapper}>
      <div className={styles.title}>Article</div>
      <a
        onClick={() => {
          trackAndOpenLink(props.link, "articleShowArticle");
        }}
        className={styles.articleButton}
      >
        <Icon className={styles.articleButtonIcon} icon="EXTERNAL_SHARE" />
        <span>Go to read the article</span>
      </a>
    </div>
  );
};

export default Article;
