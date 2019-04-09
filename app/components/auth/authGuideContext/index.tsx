import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./authGuideContext.scss");

const AuthGuideContext: React.FunctionComponent<{}> = props => {
  return (
    <div className={styles.container}>
      <Icon icon="SCINAPSE_LOGO" className={styles.logoIcon} />
      dfgljlfjadlsfjladksjflks
    </div>
  );
};
export default withStyles<typeof AuthGuideContext>(styles)(AuthGuideContext);
