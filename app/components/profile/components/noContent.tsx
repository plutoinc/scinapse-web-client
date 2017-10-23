import * as React from "react";
import Icon from "../../../icons";
import { Link } from "react-router-dom";
const styles = require("./noContent.scss");

interface IProfileEmptyContentProps {
  type: "article" | "evaluation";
}

function getSubmitArticleButton(props: IProfileEmptyContentProps) {
  if (props.type === "article") {
    return (
      <Link className={styles.submitArticleButton} to="/articles/new">
        Submit Article
      </Link>
    );
  } else {
    return null;
  }
}

const ProfileEmptyContent = (props: IProfileEmptyContentProps) => {
  return (
    <div className={styles.profileEmptyContentWrapper}>
      <div className={styles.logoWrapper}>
        <Icon className={styles.headerLogo} icon="HEADER_LOGO" />
      </div>
      <div className={styles.title}>There are no registered article.</div>
      <div className={styles.subtitle}>Share interesting articles for crypto-currency now.</div>
      {getSubmitArticleButton(props)}
    </div>
  );
};

export default ProfileEmptyContent;
