import * as React from "react";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./modifyProfile.scss");

interface ModifyProfileProps {}

interface ModifyProfileState {}

@withStyles<typeof ModifyProfileDialog>(styles)
class ModifyProfileDialog extends React.PureComponent<ModifyProfileProps, ModifyProfileState> {
  public constructor(props: ModifyProfileProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div className={styles.dialogWrapper}>HELLO</div>;
  }
}
export default ModifyProfileDialog;
