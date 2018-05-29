import { List } from "immutable";
import * as React from "react";
import SearchItem from "../searchItem";
import { Paper } from "../../../../model/paper";
import { CurrentUserRecord } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import MemberAPI, { CheckBookmarkedResponseList, CheckBookmarkedResponse } from "../../../../api/member";
import alertToast from "../../../../helpers/makePlutoToastAction";
const styles = require("./searchList.scss");

interface SearchListProps {
  currentUser: CurrentUserRecord;
  papers: Paper[];
  searchQueryText: string;
  handlePostBookmark: (paper: Paper) => Promise<void>;
  handleRemoveBookmark: (paper: Paper) => void;
  setActiveCitationDialog?: (paperId: number) => void;
  toggleCitationDialog: () => void;
  checkVerifiedUser: () => boolean;
}

interface SearchListStates {
  bookmarkedStatusList: CheckBookmarkedResponseList;
}

class SearchList extends React.PureComponent<SearchListProps, SearchListStates> {
  public constructor(props: SearchListProps) {
    super(props);

    this.state = { bookmarkedStatusList: List() };
  }

  public async componentDidMount() {
    const { currentUser, papers } = this.props;

    const isVerifiedUser = currentUser.isLoggedIn && (currentUser.oauthLoggedIn || currentUser.emailVerified);
    if (isVerifiedUser && papers && papers.length > 0) {
      const bookmarkStatusList = await MemberAPI.checkBookmarkedList(papers);

      if (bookmarkStatusList) {
        this.setState({
          bookmarkedStatusList: bookmarkStatusList,
        });
      }
    }
  }

  public async componentWillReceiveProps(nextProps: SearchListProps) {
    const authStatusWillChange = this.props.currentUser.isLoggedIn !== nextProps.currentUser.isLoggedIn;
    const isVerifiedUser = nextProps.currentUser.oauthLoggedIn || nextProps.currentUser.emailVerified;

    if (authStatusWillChange && isVerifiedUser) {
      const bookmarkStatusArray = await MemberAPI.checkBookmarkedList(nextProps.papers);

      if (bookmarkStatusArray) {
        this.setState({
          bookmarkedStatusList: bookmarkStatusArray,
        });
      }
    }
  }

  public render() {
    const { currentUser, papers, searchQueryText } = this.props;
    const { bookmarkedStatusList } = this.state;

    const searchItems =
      papers &&
      papers.map(paper => {
        if (paper) {
          const bookmarkStatus = bookmarkedStatusList.find(status => status!.paperId === paper!.id);

          return (
            <SearchItem
              key={`paper_${paper.id}`}
              paper={paper}
              isBookmarked={bookmarkStatus ? bookmarkStatus.bookmarked : false}
              checkVerifiedUser={this.props.checkVerifiedUser}
              setActiveCitationDialog={this.props.setActiveCitationDialog}
              toggleCitationDialog={this.props.toggleCitationDialog}
              handlePostBookmark={this.handlePostBookmark}
              handleRemoveBookmark={this.handleRemoveBookmark}
              withComments={true}
              searchQueryText={searchQueryText}
              currentUser={currentUser}
            />
          );
        } else {
          return null;
        }
      });

    return <div className={styles.searchItems}>{searchItems}</div>;
  }

  private handleRemoveBookmark = async (targetPaper: Paper) => {
    const { handleRemoveBookmark } = this.props;
    const targetKey = this.state.bookmarkedStatusList.findKey(status => status!.paperId === targetPaper.id);
    const newStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: false };

    this.setState({
      bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, newStatus),
    });

    try {
      await handleRemoveBookmark(targetPaper);
    } catch (err) {
      alertToast({
        type: "error",
        message: "Sorry. Failed to remove bookmark.",
      });
      const oldStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: true };
      this.setState({
        bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, oldStatus),
      });
    }
  };

  private handlePostBookmark = async (targetPaper: Paper) => {
    const { handlePostBookmark } = this.props;
    const targetKey = this.state.bookmarkedStatusList.findKey(status => status!.paperId === targetPaper.id);
    const newStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: true };

    this.setState({
      bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, newStatus),
    });

    try {
      await handlePostBookmark(targetPaper);
    } catch (err) {
      alertToast({
        type: "error",
        message: "Sorry. Failed to make bookmark.",
      });
      const oldStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: false };
      this.setState({
        bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, oldStatus),
      });
    }
  };
}

export default withStyles<typeof SearchList>(styles)(SearchList);
