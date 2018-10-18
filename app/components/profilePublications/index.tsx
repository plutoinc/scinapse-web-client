import * as React from "react";
import * as H from "history";
import { CurrentUser } from "../../model/currentUser";
import { withStyles } from "../../helpers/withStylesHelper";
import { Paper } from "../../model/paper";
import { ProfileShowState } from "../../containers/profileShow/reducer";
import PaperItem from "../common/paperItem";
import DesktopPagination from "../common/desktopPagination";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
import ArticleSpinner from "../common/spinner/articleSpinner";
const styles = require("./profilePublications.scss");

interface ProfilePublicationsProps {
  currentUser: CurrentUser;
  profileShow: ProfileShowState;
  papers: Paper[];
  location: H.Location;
  fetchPapers: (page: number) => void;
}

@withStyles<typeof ProfilePublications>(styles)
class ProfilePublications extends React.PureComponent<ProfilePublicationsProps> {
  public componentWillReceiveProps(nextProps: ProfilePublicationsProps) {
    if (
      this.props.location.pathname !== nextProps.location.pathname ||
      this.props.location.search !== nextProps.location.search
    ) {
      const queryParams: { page?: string } = getQueryParamsObject(nextProps.location.search);
      const nextPage = queryParams.page ? parseInt(queryParams.page, 10) : 1;
      this.props.fetchPapers(nextPage);
    }
  }

  public render() {
    const { profileShow } = this.props;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <span>Publications</span>
          <span>{profileShow.numberOfPapers}</span>
        </div>

        <div className={styles.contentWrapper}>{this.getPaperList()}</div>

        <div className={styles.paginationWrapper}>
          <DesktopPagination
            currentPageIndex={profileShow.page - 1}
            totalPage={profileShow.totalPaperPage}
            type="profile_publications"
            getLinkDestination={this.getPageLinkDestination}
          />
        </div>
      </div>
    );
  }

  private getPageLinkDestination = (page: number) => {
    const { profileShow } = this.props;
    return {
      to: `/profiles/${profileShow.profileId}/publications`,
      search: `?page=${page}`,
    };
  };

  private getPaperList = () => {
    const { profileShow, currentUser, papers } = this.props;

    if (profileShow.loadingPapers) {
      return (
        <div>
          <ArticleSpinner />
        </div>
      );
    }

    return papers.map(paper => {
      return <PaperItem key={paper.id} currentUser={currentUser} paper={paper} />;
    });
  };
}

export default ProfilePublications;
