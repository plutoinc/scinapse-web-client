import * as React from "react";
import { Link } from "react-router-dom";
import { IMemberRecord } from "../../../model/member";
import { ICurrentUserRecord } from "../../../model/currentUser";
import UserProfileIcon from "../../common/userProfileIcon";
import { trackAction } from "../../../helpers/handleGA";

const styles = require("./reviewUserInformation.scss");

interface IReviewUserInformationProps {
  user: IMemberRecord | ICurrentUserRecord;
  className?: string;
}

const ReviewUserInformation = ({ className = "", user }: IReviewUserInformationProps) => {
  return (
    <Link
      to={`/users/${user.id}`}
      onClick={() => trackAction(`/users/${user.id}`, "reviewUserInformation")}
      className={className}
    >
      <div className={styles.userImageWrapper}>
        <UserProfileIcon profileImage={user.profileImage} userId={user.id} type="small" />
      </div>
      <span className={styles.userInformation}>
        <div className={styles.username}>{user.name}</div>
        <div className={styles.organization}>{user.institution}</div>
      </span>
    </Link>
  );
};

export default ReviewUserInformation;
