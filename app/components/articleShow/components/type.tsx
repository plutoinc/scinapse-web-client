import * as React from "react";
import { ARTICLE_CATEGORY } from "../../articleCreate/records";
const styles = require("./type.scss");

export interface ITypeProps {
  tag: ARTICLE_CATEGORY;
}

function getArticleTypeContent(articleType: ARTICLE_CATEGORY) {
  let articleCategoryContent: string;
  switch (articleType) {
    case "POST_PAPER":
      articleCategoryContent = "Post Paper";
      break;
    case "PRE_PAPER":
      articleCategoryContent = "Pre Paper";
      break;
    case "WHITE_PAPER":
      articleCategoryContent = "White Paper";
      break;
    case "TECH_BLOG":
      articleCategoryContent = "Tech Blog";
      break;
    default:
      articleCategoryContent = "Select Category";
  }

  return articleCategoryContent;
}

const Type = (props: ITypeProps) => {
  return (
    <div className={styles.tagListWrapper}>
      <a className={styles.tagItem}>{getArticleTypeContent(props.tag)}</a>
    </div>
  );
};

export default Type;
