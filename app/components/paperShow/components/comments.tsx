import * as React from "react";
import { List } from "immutable";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ICommentRecord } from "../../../model/comment";
const styles = require("./comments.scss");

interface PaperShowCommentsProps {
  comments: List<ICommentRecord>;
}

class PaperShowComments extends React.PureComponent<PaperShowCommentsProps, {}> {
  public render() {
    console.log(this.props);

    return <div>Hello Comments</div>;
  }
}

export default withStyles<typeof PaperShowComments>(styles)(PaperShowComments);
