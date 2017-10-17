import * as React from "react";
import { ICurrentUserRecord } from "../../../model/currentUser";
import Icon from "../../../icons";
const styles = require("./evaluateUserInformation.scss");

interface IEvaluateUserInformationProps {
  currentUser: ICurrentUserRecord;
  className?: string;
}

const EvaluateUserInformation = ({ className = "", currentUser }: IEvaluateUserInformationProps) => {
  return (
    <div className={className}>
      <span className={styles.userImageWrapper}>
        {/* TODO: Connect user Profile image */}
        {/* <RoundImage width={37} height={37} /> */}
        <Icon className={styles.avatarIcon} icon="AVATAR" />
      </span>
      <span className={styles.userInformation}>
        <div className={styles.username}>{currentUser.name || "Mock CurrentName"}</div>
        <div className={styles.organization}>{currentUser.institution}</div>
      </span>
    </div>
  );
};

export default EvaluateUserInformation;
