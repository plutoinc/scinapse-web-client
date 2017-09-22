import * as React from "react";
import { ICurrentUserStateRecord } from "../../../model/currentUser";
import Icon from "../../../icons";
const styles = require("./evaluateUserInformation.scss");

interface IEvaluateUserInformationProps {
  currentUser: ICurrentUserStateRecord;
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
        <div className={styles.username}>{currentUser.nickName || "Mock CurrentName"}</div>
        <div className={styles.organization}>
          {/* TODO: Connect organization data */}
          University of Michigan
        </div>
      </span>
    </div>
  );
};

export default EvaluateUserInformation;
