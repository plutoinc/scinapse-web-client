import * as React from "react";
import { List } from "immutable";
import * as classNames from "classnames";
import Author from "./author";
import { PaperAuthorRecord } from "../../../model/author";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./authorList.scss");

interface PaperAuthorListProps {
  authors: List<PaperAuthorRecord>;
  isAuthorBoxExtended: boolean;
  handleToggleAuthorBox: () => void;
}

class PaperAuthorList extends React.PureComponent<PaperAuthorListProps, {}> {
  public render() {
    const authors = this.props.authors.map((author, index) => {
      return <Author author={author} key={`$${author.id}_${index}`} />;
    });

    const authorCount = this.props.authors.count();
    const itemPerRow = 3;
    const itemHeight = 60;

    const authorListMaxHeight = `${Math.ceil(authorCount / itemPerRow) * itemHeight}px`;

    return (
      <div className={styles.authorWrapper}>
        <div
          style={{
            maxHeight: this.props.isAuthorBoxExtended ? authorListMaxHeight : "60px",
          }}
          className={styles.authorList}
        >
          {authors}
        </div>
        {this.getToggleButton()}
      </div>
    );
  }

  private getToggleButton = () => {
    if (this.props.authors.count() > 3) {
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
