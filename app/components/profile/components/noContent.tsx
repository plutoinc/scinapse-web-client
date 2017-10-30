import * as React from "react";
import Icon from "../../../icons";
import { Link } from "react-router-dom";
const styles = require("./noContent.scss");

interface IProfileEmptyContentProps {
  type: "article" | "evaluation";
}

function getEmptyContentTitle(props: IProfileEmptyContentProps) {
  switch (props.type) {
    case "article":
      return "There are no registered article.";
    case "evaluation":
      return "You have not evaluated yet.";
    default:
      return null;
  }
}

function getEmptyContentSubTitle(props: IProfileEmptyContentProps) {
  switch (props.type) {
    case "article":
      return "Share interesting articles for crypto-currency now.";
    case "evaluation":
      return "Try evaluating the article you're interested in.";
    default:
      return null;
  }
}

function getSubmitArticleButton(props: IProfileEmptyContentProps) {
  switch (props.type) {
    case "article":
      return (
        <Link className={styles.submitArticleButton} to="/articles/new">
          Submit Article
        </Link>
      );
    case "evaluation":
      return (
        <Link className={styles.submitArticleButton} to="/">
          Article Feed
        </Link>
      );
    default:
      return null;
  }
}

const ProfileEmptyContent = (props: IProfileEmptyContentProps) => {
  return (
    <div className={styles.profileEmptyContentWrapper}>
      <div className={styles.logoWrapper}>
        <Icon className={styles.headerLogo} icon="FOOTER_LOGO" />
      </div>
      <div className={styles.title}>{getEmptyContentTitle(props)}</div>
      <div className={styles.subtitle}>{getEmptyContentSubTitle(props)}</div>
      {getSubmitArticleButton(props)}
    </div>
  );
};

export default ProfileEmptyContent;
