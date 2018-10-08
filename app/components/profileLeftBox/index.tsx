import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
// import { Member } from "../../model/member";
// import { Profile } from "../../model/profile";
const styles = require("./profileLeftBox.scss");

interface ProfileLeftBoxProps {
  // member: Member;
  // profile: Profile | null;
}

@withStyles<typeof ProfileLeftBox>(styles)
class ProfileLeftBox extends React.PureComponent<ProfileLeftBoxProps, {}> {
  public render() {
    const mockMember = {
      name: "Tylor Shin",
      affiliation: "CAU",
      email: "tylor.shin@gmail.com",
    };

    return (
      <div>
        {this.getUserIcon()}
        <div className={styles.username}>{mockMember.name}</div>
        <div className={styles.affiliation}>{mockMember.affiliation}</div>

        <div className={styles.emailBox}>
          <Icon icon="EMAIL_ICON" className={styles.emailIcon} />
          {mockMember.email}
        </div>
      </div>
    );
  }

  private getUserIcon = () => {
    const mockMember = "Tylor Shin";
    const firstLetter = mockMember.slice(0, 1);

    return (
      <div className={styles.letterBox}>
        <div className={styles.firstLetter}>{firstLetter}</div>
      </div>
    );
  };
}

export default ProfileLeftBox;
