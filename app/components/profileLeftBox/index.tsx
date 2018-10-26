import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { Profile } from "../../model/profile";
import { Member } from "../../model/member";
const styles = require("./profileLeftBox.scss");

interface ProfileLeftBoxProps {
  profile?: Profile | null;
  member?: Member;
}

@withStyles<typeof ProfileLeftBox>(styles)
class ProfileLeftBox extends React.PureComponent<ProfileLeftBoxProps, {}> {
  public render() {
    const { profile, member } = this.props;

    if (profile) {
      return (
        <div className={styles.boxWrapper}>
          {this.getUserIcon()}
          <div className={styles.username}>{`${profile.firstName} ${profile.lastName || ""}`}</div>
          <div className={styles.affiliation}>{profile.affiliation}</div>
          <div className={styles.emailBox}>
            <Icon icon="EMAIL_ICON" className={styles.emailIcon} />
            {profile.email}
          </div>
        </div>
      );
    } else if (member) {
      return (
        <div className={styles.boxWrapper}>
          {this.getUserIcon()}
          <div className={styles.username}>{`${member.firstName} ${member.lastName || ""}`}</div>
          <div className={styles.affiliation}>{member.affiliation}</div>
          <div className={styles.emailBox}>
            <Icon icon="EMAIL_ICON" className={styles.emailIcon} />
            {member.email}
          </div>
        </div>
      );
    }
    return null;
  }

  private getUserIcon = () => {
    const { profile, member } = this.props;

    let firstChar: string = "";
    if (profile) {
      firstChar = profile.firstName.slice(0, 1).toUpperCase();
    } else if (member) {
      firstChar = member.firstName.slice(0, 1).toUpperCase();
    }

    return (
      <div className={styles.letterBox}>
        <div className={styles.firstLetter}>{firstChar}</div>
      </div>
    );
  };
}

export default ProfileLeftBox;
