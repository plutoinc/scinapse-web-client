import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { Profile } from "../../model/profile";
const styles = require("./profileLeftBox.scss");

interface ProfileLeftBoxProps {
  profile: Profile | null;
}

@withStyles<typeof ProfileLeftBox>(styles)
class ProfileLeftBox extends React.PureComponent<ProfileLeftBoxProps, {}> {
  public render() {
    const { profile } = this.props;

    // TODO: Change below block code with existing member logic
    if (!profile) {
      return null;
    }

    return (
      <div>
        {this.getUserIcon()}
        <div className={styles.username}>{`${profile.member.firstName} ${profile.member.lastName || ""}`}</div>
        <div className={styles.affiliation}>{profile.affiliation}</div>

        <div className={styles.emailBox}>
          <Icon icon="EMAIL_ICON" className={styles.emailIcon} />
          {profile.member.email}
        </div>
      </div>
    );
  }

  private getUserIcon = () => {
    const { profile } = this.props;

    if (!profile) {
      return null;
    }

    return (
      <div className={styles.letterBox}>
        <div className={styles.firstLetter}>{profile.member.firstName.slice(0, 1).toUpperCase()}</div>
      </div>
    );
  };
}

export default ProfileLeftBox;
