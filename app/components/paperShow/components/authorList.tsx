import * as React from "react";
import * as classNames from "classnames";
import Author from "./author";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { PaperAuthor } from "../../../model/author";
import { LayoutState, UserDevice } from "../../layouts/records";
const styles = require("./authorList.scss");

interface PaperAuthorListProps {
  layout: LayoutState;
  authors: PaperAuthor[];
  isAuthorBoxExtended: boolean;
  handleToggleAuthorBox: () => void;
}

class PaperAuthorList extends React.PureComponent<PaperAuthorListProps, {}> {
  public render() {
    const { authors, layout } = this.props;

    const authorList = authors.map(author => {
      if (author) {
        return <Author author={author} key={author.id} />;
      }
    });

    const hasSmallAuthorWithPortableDevice = layout.userDevice !== UserDevice.DESKTOP && authorList.length <= 3;
    const shouldOpenBox = this.props.isAuthorBoxExtended || hasSmallAuthorWithPortableDevice;

    return (
      <div className={styles.authorWrapper}>
        <div
          style={{
            maxHeight: shouldOpenBox ? "unset" : "60px",
          }}
          className={styles.authorList}
        >
          {authorList}
        </div>
        {this.getToggleButton()}
      </div>
    );
  }

  private getToggleButton = () => {
    if (this.props.authors.length > 3) {
      return (
        <div className={styles.arrowIconWrapper} onClick={this.props.handleToggleAuthorBox}>
          <Icon
            className={classNames({
              [`${styles.arrowIcon}`]: true,
              [`${styles.open}`]: this.props.isAuthorBoxExtended,
            })}
            icon="ARROW_POINT_TO_DOWN"
          />
        </div>
      );
    } else {
      return null;
    }
  };
}

export default withStyles<typeof PaperAuthorList>(styles)(PaperAuthorList);
