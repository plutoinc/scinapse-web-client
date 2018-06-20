import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./collection.scss");

@withStyles<typeof CollectionModal>(styles)
class CollectionModal extends React.PureComponent<{}, {}> {
  public render() {
    return <div />;
  }
}
export default CollectionModal;
