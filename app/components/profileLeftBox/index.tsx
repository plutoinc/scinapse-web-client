import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import { Member } from "../../model/member";
import { Profile } from "../../model/profile";
const styles = require("./profileLeftBox.scss");

interface ProfileLeftBoxProps {
  member: Member;
  profile: Profile | null;
}

@withStyles<typeof ProfileLeftBox>(styles)
class ProfileLeftBox extends React.PureComponent<ProfileLeftBoxProps, {}> {
  public render() {
    return <div>Hello Profile</div>;
  }
}

export default ProfileLeftBox;
