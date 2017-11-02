import * as React from "react";
import { Link } from "react-router-dom";
import { IMemberRecord } from "../../../model/member";
import { ICurrentUserRecord } from "../../../model/currentUser";
import UserProfileIcon from "../../common/userProfileIcon";
const styles = require("./evaluateUserInformation.scss");

interface IEvaluateUserInformationProps {
  user: IMemberRecord | ICurrentUserRecord;
  className?: string;
}

const EvaluateUserInformation = ({ className = "", user }: IEvaluateUserInformationProps) => {
  return (
    <Link to={`/users/${user.id}`} className={className}>
      <span className={styles.userImageWrapper}>
        <UserProfileIcon profileImage={user.profileImage} userId={user.id} type="small" />
      </span>
      <span className={styles.userInformation}>
        <div className={styles.username}>{user.name}</div>
        <div className={styles.organization}>{user.institution}</div>
      </span>
    </Link>
  );
};

export default EvaluateUserInformation;
