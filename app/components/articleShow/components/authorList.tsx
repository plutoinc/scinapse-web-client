import * as React from "react";
import { IAuthorRecord } from "../../../model/author";
import { List } from "immutable";
const styles = require("./authorList.scss");

export interface IAuthorListProps {
  authors: List<IAuthorRecord>;
}
export interface IAuthorListState {
  isAuthorListOpen: boolean;
}

class AuthorList extends React.PureComponent<IAuthorListProps, IAuthorListState> {
  constructor(props: IAuthorListProps) {
    super(props);

    this.state = {
      isAuthorListOpen: false,
    };
  }

  private mapAuthItem = (author: IAuthorRecord) => {
    return (
      <span key={author.id} className={styles.authorItem}>
        <div className={styles.contentWrapper}>
          <div>
            <div className={styles.authorName}>{author.name}</div>
            <div className={styles.authorOrganization}>{author.institution}</div>
          </div>
        </div>
      </span>
    );
  };

  private getAuthItems = (props: List<IAuthorRecord>, isAuthorListOpen: boolean) => {
    if (isAuthorListOpen) {
      return props.map(this.mapAuthItem);
    } else {
      return props.slice(0, 3).map(this.mapAuthItem);
    }
  };

  private openAuthorList = () => {
    this.setState({
      isAuthorListOpen: true,
    });
  };

  private getMoreButton = (props: List<IAuthorRecord>, isAuthorListOpen: boolean) => {
    if (isAuthorListOpen) {
      return null;
    } else if (props.size > 3) {
      return (
        <div onClick={this.openAuthorList} className={styles.moreButton}>
          + More
        </div>
      );
    } else {
      return null;
    }
  };

  public render() {
    const props = this.props;
    const { isAuthorListOpen } = this.state;

    return (
      <div className={styles.authorListContainer}>
        <div className={styles.authorListWrapper}>{this.getAuthItems(props.authors, isAuthorListOpen)}</div>
        {this.getMoreButton(props.authors, isAuthorListOpen)}
      </div>
    );
  }
}

export default AuthorList;
