import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./authorListDialog.scss");

interface AuthorListDialogProps {
  handleCloseDialogRequest: () => void;
}

@withStyles<typeof AuthorListDialog>(styles)
class AuthorListDialog extends React.PureComponent<AuthorListDialogProps> {
  public render() {
    // const { handleCloseDialogRequest } = this.props;

    return <div className={styles.dialogWrapper}>Hola Dialog</div>;
  }
}
export default AuthorListDialog;
