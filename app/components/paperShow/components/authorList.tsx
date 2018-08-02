import * as React from "react";
import * as classNames from "classnames";
import Author from "./author";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { PaperAuthor } from "../../../model/author";
const styles = require("./authorList.scss");

interface PaperAuthorListProps {
  authors: PaperAuthor[];
  isAuthorBoxExtended: boolean;
  handleToggleAuthorBox: () => void;
}

class PaperAuthorList extends React.PureComponent<PaperAuthorListProps, {}> {
  public render() {
    const authors = this.props.authors.map((author, index) => {
      if (author) {
        return <Author author={author} key={`$${author.id}_${index}`} />;
      }
    });

    return (
      <div className={styles.authorWrapper}>
        <div
          style={{
            maxHeight: this.props.isAuthorBoxExtended ? "fit-content" : "60px",
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
