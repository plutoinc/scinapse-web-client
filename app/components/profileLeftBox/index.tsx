import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./profileLeftBox.scss");

interface ProfileLeftBoxProps {}

@withStyles<typeof ProfileLeftBox>(styles)
class ProfileLeftBox extends React.PureComponent<ProfileLeftBoxProps, {}> {
  public render() {
    return <div>Hello Profile</div>;
  }
}

export default ProfileLeftBox;
