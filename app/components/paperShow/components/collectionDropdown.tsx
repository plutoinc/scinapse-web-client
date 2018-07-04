import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./bookmarkButton.scss");

interface CollectionDropdownProps {}

class CollectionDropdown extends React.PureComponent<
  CollectionDropdownProps,
  {}
> {
  public render() {
    return ()
  }
}

export default withStyles<typeof CollectionDropdown>(styles)(
  CollectionDropdown
);
