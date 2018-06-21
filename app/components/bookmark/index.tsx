import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { isToday, format } from "date-fns";
import { AppState } from "../../reducers";
import Pagination from "../common/commonPagination";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import EnvChecker from "../../helpers/envChecker";
import SearchItem from "../articleSearch/components/searchItem";
import CitationDialog from "../common/citationDialog";
import { getBookmarks } from "../layouts/actions";
import {
  clearBookmarkPageState,
  setActiveCitationDialogPaperId,
  toggleCitationDialog,
  handleClickCitationTab,
  getCitationText,
} from "./actions";
import { BookmarkPageState } from "./records";
import { Bookmark } from "../../model/bookmark";
import { Paper } from "../../model/paper";
import { postBookmark, removeBookmark } from "../../actions/bookmark";
import { AvailableCitationType } from "../paperShow/records";
import { openSignUp } from "../dialog/actions";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import MemberAPI, { CheckBookmarkedResponse } from "../../api/member";
import alertToast from "../../helpers/makePlutoToastAction";
const styles = require("./bookmark.scss");

const DEFAULT_BOOKMARKS_FETCHING_COUNT = 10;

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    bookmarks: state.bookmarks,
    bookmarkPage: state.bookmarkPage,
  };
}

export interface BookmarkPageProps
  extends RouteComponentProps<{ paperId: string }> {
  currentUser: CurrentUser;
  bookmarks: Bookmark;
  bookmarkPage: BookmarkPageState;
  dispatch: Dispatch<any>;
}

interface BookmarkPageStates
  extends Readonly<{
      bookmarkedStatusList: CheckBookmarkedResponse[];
    }> {}

@withStyles<typeof BookmarkPage>(styles)
class BookmarkPage extends React.PureComponent<
  BookmarkPageProps,
  BookmarkPageStates
> {
  public constructor(props: BookmarkPageProps) {
    super(props);

    this.state = { bookmarkedStatusList: [] };
  }

  public async componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (currentUser.isLoggedIn) {
      this.fetchBookmark();
    } else {
      dispatch(openSignUp());
    }
  }

  public componentWillReceiveProps(nextProps: BookmarkPageProps) {
    const { dispatch, currentUser } = nextProps;

    if (!currentUser.isLoggedIn) {
      dispatch(openSignUp());
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(clearBookmarkPageState());
  }

  public render() {
    const { currentUser } = this.props;

    if (EnvChecker.isServer()) {
      return this.getHelmetNode();
    }

    if (!currentUser.isLoggedIn) {
      return null;
    }

    return (
      <div className={styles.container}>
        {this.getHelmetNode()}
        <div className={styles.titleWrapper}>Bookmarked Papers</div>
        {this.mapPaperNode()}
        {this.getPaginationNode()}
        {this.getCitationDialog()}
      </div>
    );
  }

  private getHelmetNode = () => {
    return (
      <Helmet>
        <title>Bookmark | Sci-napse | Academic search engine for paper</title>
      </Helmet>
    );
  };

  private getPaginationNode = () => {
    const { bookmarkPage } = this.props;

    return (
      <div className={styles.paginationBox}>
        <Pagination
          type="BOOKMARK_PAGINATION"
          currentPageIndex={bookmarkPage.currentPage - 1}
          totalPage={bookmarkPage.totalPageCount}
          onItemClick={this.fetchBookmark}
        />
      </div>
    );
  };

  private fetchBookmark = async (pageIndex = 0) => {
    const { dispatch } = this.props;

    const bookmarkDataList = await dispatch(
      getBookmarks({
        page: pageIndex + 1,
        size: DEFAULT_BOOKMARKS_FETCHING_COUNT,
      }),
    );
    if (bookmarkDataList) {
      const bookmarkedPaperList = bookmarkDataList.map(bookmarkData => {
        return bookmarkData.paper;
      });

      // TODO: Change this later
      const bookmarkStatusList = await MemberAPI.checkBookmarkedList(
        bookmarkedPaperList,
      );

      if (bookmarkStatusList) {
        this.setState({
          bookmarkedStatusList: bookmarkStatusList,
        });
      }
    }
  };

  private setActiveCitationDialog = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(setActiveCitationDialogPaperId(paperId));
  };

  private toggleCitationDialog = () => {
    const { dispatch } = this.props;

    dispatch(toggleCitationDialog());
  };

  private handlePostBookmark = async (targetPaper: Paper) => {
    const { dispatch, currentUser } = this.props;

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      const index = this.state.bookmarkedStatusList.findIndex(
        status => status!.paperId === targetPaper.id,
      );
      const newStatus: CheckBookmarkedResponse = {
        paperId: targetPaper.id,
        bookmarked: true,
      };

      if (index > -1) {
        this.setState({
          bookmarkedStatusList: [
            ...this.state.bookmarkedStatusList.slice(0, index),
            ...[newStatus],
            ...this.state.bookmarkedStatusList.slice(index + 1),
          ],
        });
      }

      try {
        await dispatch(postBookmark(targetPaper));
      } catch (err) {
        alertToast({
          type: "error",
          message: "Sorry. Failed to make bookmark.",
        });

        const oldStatus: CheckBookmarkedResponse = {
          paperId: targetPaper.id,
          bookmarked: false,
        };

        this.setState({
          bookmarkedStatusList: [
            ...this.state.bookmarkedStatusList.slice(0, index),
            ...[oldStatus],
            ...this.state.bookmarkedStatusList.slice(index + 1),
          ],
        });
      }
    }
  };

  private handleRemoveBookmark = async (targetPaper: Paper) => {
    const { dispatch, currentUser } = this.props;
    const { bookmarkedStatusList } = this.state;

    checkAuthDialog();

    if (currentUser.isLoggedIn && bookmarkedStatusList.length > 0) {
      const index = bookmarkedStatusList.findIndex(
        status => status!.paperId === targetPaper.id,
      );
      const newStatus: CheckBookmarkedResponse = {
        paperId: targetPaper.id,
        bookmarked: false,
      };

      this.setState({
        bookmarkedStatusList: [
          ...bookmarkedStatusList.slice(0, index),
          ...[newStatus],
          ...bookmarkedStatusList.slice(index + 1),
        ],
      });

      try {
        await dispatch(removeBookmark(targetPaper));
      } catch (err) {
        alertToast({
          type: "error",
          message: "Sorry. Failed to remove bookmark.",
        });
        const oldStatus: CheckBookmarkedResponse = {
          paperId: targetPaper.id,
          bookmarked: true,
        };
        this.setState({
          bookmarkedStatusList: [
            ...bookmarkedStatusList.slice(0, index),
            ...[oldStatus],
            ...bookmarkedStatusList.slice(index + 1),
          ],
        });
      }
    }
  };

  private handleClickCitationTab = (
    tab: AvailableCitationType,
    paperId: number,
  ) => {
    const { dispatch } = this.props;

    dispatch(handleClickCitationTab(tab));
    dispatch(getCitationText({ type: tab, paperId }));
  };

  private getCitationDialog = () => {
    const { bookmarkPage } = this.props;

    return (
      <CitationDialog
        paperId={bookmarkPage.activeCitationDialogPaperId}
        isOpen={bookmarkPage.isCitationDialogOpen}
        toggleCitationDialog={this.toggleCitationDialog}
        handleClickCitationTab={this.handleClickCitationTab}
        activeTab={bookmarkPage.activeCitationTab}
        isLoading={bookmarkPage.isFetchingCitationInformation}
        citationText={bookmarkPage.citationText}
      />
    );
  };

  private mapPaperNode = () => {
    const { currentUser, bookmarks } = this.props;

    if (!bookmarks.bookmarkData || bookmarks.bookmarkData.length === 0) {
      return null;
    }

    const searchItems = bookmarks.bookmarkData.map(bookmarkDatum => {
      const paper = bookmarkDatum!.paper;
      const bookmarkedDate = isToday(bookmarkDatum!.createdAt)
        ? "TODAY"
        : format(bookmarkDatum!.createdAt, "MMM/DD/YYYY");

      const bookmarkStatus = this.state.bookmarkedStatusList.find(
        status => status!.paperId === paper.id,
      );

      return (
        <div key={`paper_${paper.id}`}>
          <div className={styles.dateBox}>{bookmarkedDate}</div>
          <SearchItem
            paper={paper}
            isBookmarked={bookmarkStatus ? bookmarkStatus.bookmarked : false}
            setActiveCitationDialog={this.setActiveCitationDialog}
            toggleCitationDialog={this.toggleCitationDialog}
            handlePostBookmark={this.handlePostBookmark}
            handleRemoveBookmark={this.handleRemoveBookmark}
            searchQueryText=""
            currentUser={currentUser}
          />
        </div>
      );
    });

    return <div className={styles.searchItems}>{searchItems}</div>;
  };
}

export default connect(mapStateToProps)(withRouter(BookmarkPage));
