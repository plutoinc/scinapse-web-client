import * as React from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Dispatch, connect } from "react-redux";
import { denormalize } from "normalizr";
import { withStyles } from "../../helpers/withStylesHelper";
import Keyword from "../../components/paperShow/components/keyword";
import { Configuration } from "../../reducers/configuration";
import { CurrentUser } from "../../model/currentUser";
import { Author, authorSchema } from "../../model/author/author";
import { Paper, paperSchema } from "../../model/paper";
import ArticleSpinner from "../../components/common/spinner/articleSpinner";
import ScinapseInput from "../../components/common/scinapseInput";
import { LayoutState } from "../../components/layouts/records";
import Footer from "../../components/layouts/footer";
import { ConnectedAuthorShowState } from "./reducer";
import PaperItem from "../../components/common/paperItem";
import DesktopPagination from "../../components/common/desktopPagination";
import CoAuthor from "../../components/common/coAuthor";
import { fetchAuthorPapers } from "../authorShow/sideEffect";
import SelectedPublicationsDialog from "../../components/dialog/components/selectedPublications";
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from "../../components/common/sortBox";
import TransparentButton from "../../components/common/transparentButton";
import ModifyProfile, { ModifyProfileFormState } from "../../components/dialog/components/modifyProfile";
import { Affiliation } from "../../model/affiliation";
import { SuggestAffiliation } from "../../api/suggest";
import {
  updateAuthor,
  removePaperFromPaperList,
  succeedToUpdateAuthorSelectedPaperList,
  openAddPublicationsToAuthorDialog,
} from "../../actions/author";
import PlutoAxios from "../../api/pluto";
import { ActionCreators } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";
import AuthorShowHeader from "../../components/authorShowHeader";
import Icon from "../../icons";
import formatNumber from "../../helpers/formatNumber";
import { AppState } from "../../reducers";
const styles = require("./connectedAuthor.scss");

export interface ConnectedAuthorShowMatchParams {
  authorId: string;
}

interface ConnectedAuthorShowOwnState {
  isOpenSelectedPaperDialog: boolean;
  isOpenModifyProfileDialog: boolean;
}

export interface ConnectedAuthorShowProps {
  layout: LayoutState;
  author: Author;
  coAuthors: Author[];
  papers: Paper[];
  authorShow: ConnectedAuthorShowState;
  configuration: Configuration;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

@withStyles<typeof ConnectedAuthorShow>(styles)
class ConnectedAuthorShow extends React.PureComponent<ConnectedAuthorShowProps, ConnectedAuthorShowOwnState> {
  private cancelToken = axios.CancelToken.source();

  public constructor(props: ConnectedAuthorShowProps) {
    super(props);

    this.state = {
      isOpenSelectedPaperDialog: false,
      isOpenModifyProfileDialog: false,
    };
  }

  public componentDidMount() {
    const { currentUser, author, authorShow } = this.props;

    if (currentUser.isLoggedIn && currentUser.is_author_connected && currentUser.author_id === author.id) {
      this.fetchPapers(authorShow.papersCurrentPage, "RECENTLY_ADDED");
    }
  }

  public componentWillReceiveProps(nextProps: ConnectedAuthorShowProps) {
    const { currentUser, author, authorShow } = this.props;

    const hasAuthStatusChanged = nextProps.currentUser.isLoggedIn !== currentUser.isLoggedIn;
    const wasDefaultSortOption =
      authorShow.papersSort === "NEWEST_FIRST" &&
      authorShow.papersCurrentPage === 1 &&
      authorShow.paperSearchQuery === "";

    if (
      hasAuthStatusChanged &&
      nextProps.currentUser.isLoggedIn &&
      nextProps.currentUser.is_author_connected &&
      nextProps.currentUser.author_id === author.id &&
      wasDefaultSortOption
    ) {
      this.fetchPapers(authorShow.papersCurrentPage, "RECENTLY_ADDED");
    } else if (hasAuthStatusChanged && authorShow.papersSort === "RECENTLY_ADDED") {
      this.fetchPapers(authorShow.papersCurrentPage, "NEWEST_FIRST");
    }
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { author, authorShow, currentUser } = this.props;
    const { isOpenModifyProfileDialog, isOpenSelectedPaperDialog } = this.state;

    if (authorShow.isLoadingPage) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    }

    return (
      <div className={styles.authorShowPageWrapper}>
        {this.getPageHelmet()}
        <div className={styles.rootWrapper}>
          <AuthorShowHeader
            author={author}
            rightBoxContent={this.getRightBoxContent()}
            navigationContent={
              <div className={styles.tabNavigationWrapper}>
                <span className={styles.tabNavigationItem}>PUBLICATIONS</span>
              </div>
            }
          />
          <div className={styles.contentBox}>
            <div className={styles.container}>
              <div className={styles.leftContentWrapper}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>Selected Publications</span>
                  <span className={styles.countBadge}>{author.selectedPapers.length}</span>
                  <div className={styles.rightBox}>{this.getEditSelectedPaperButton()}</div>
                </div>
                <div className={styles.selectedPaperDescription}>
                  Selected Publications are representative papers selected by the author.
                </div>
                {this.getSelectedPapers()}

                <div className={styles.allPublicationHeader}>
                  <span className={styles.sectionTitle}>All Publications</span>
                  <span className={styles.countBadge}>{author.paperCount}</span>
                  <div className={styles.rightBox}>{this.getAddPublicationsButton()}</div>
                </div>
                <div className={styles.selectedPaperDescription}>
                  All Publications are all papers published by this author.
                </div>
                <div className={styles.searchSortWrapper}>
                  <div>
                    <ScinapseInput
                      placeholder="Search paper by keyword"
                      onSubmit={this.handleSubmitPublicationSearch}
                      icon="SEARCH_ICON"
                      wrapperStyle={{
                        borderRadius: "4px",
                        borderColor: "#f1f3f6",
                        backgroundColor: "#f9f9fa",
                        width: "320px",
                        height: "36px",
                      }}
                    />
                    <div className={styles.paperCountMetadata}>
                      {/* tslint:disable-next-line:max-line-length */}
                      {authorShow.papersCurrentPage} page of {formatNumber(authorShow.papersTotalPage)} pages ({formatNumber(
                        authorShow.papersTotalCount
                      )}{" "}
                      results)
                    </div>
                  </div>
                  <div className={styles.rightBox}>
                    <SortBox
                      sortOption={authorShow.papersSort}
                      handleClickSortOption={this.handleClickSort}
                      exposeRecentlyUpdated={currentUser.author_id === author.id}
                      exposeRelevanceOption={false}
                    />
                  </div>
                </div>
                {this.getAllPublications()}
                <DesktopPagination
                  type="AUTHOR_SHOW_PAPERS_PAGINATION"
                  totalPage={authorShow.papersTotalPage}
                  currentPageIndex={authorShow.papersCurrentPage - 1}
                  onItemClick={this.fetchPapers}
                  wrapperStyle={{
                    margin: "45px 0 40px 0",
                  }}
                />
              </div>
              <div className={styles.rightContentWrapper}>
                {this.getCoAuthorList()}
                {this.getFosList()}
              </div>
            </div>
          </div>
        </div>
        <Footer />
        {isOpenSelectedPaperDialog ? (
          <SelectedPublicationsDialog
            currentUser={currentUser}
            isOpen={isOpenSelectedPaperDialog}
            author={author}
            handleClose={this.handleToggleSelectedPublicationsDialog}
            handleSubmit={this.handleSubmitUpdateSelectedPapers}
          />
        ) : null}
        <ModifyProfile
          author={author}
          handleClose={this.handleToggleModifyProfileDialog}
          isOpen={isOpenModifyProfileDialog}
          onSubmit={this.handleSubmitProfile}
          isLoading={authorShow.isLoadingToUpdateProfile}
          initialValues={{
            authorName: author.name,
            currentAffiliation: author.lastKnownAffiliation ? author.lastKnownAffiliation || "" : "",
            bio: author.bio || "",
            website: author.webPage || "",
            email: author.email,
          }}
        />
      </div>
    );
  }

  private getAddPublicationsButton = () => {
    const { author, currentUser } = this.props;

    if (currentUser.author_id === author.id) {
      return (
        <TransparentButton
          onClick={this.handleOpenAllPublicationsDialog}
          gaCategory="AddPublications"
          content="Add Publications"
          icon="SMALL_PLUS"
        />
      );
    }
    return null;
  };

  private getEditSelectedPaperButton = () => {
    const { author, currentUser } = this.props;

    if (currentUser.author_id === author.id) {
      return (
        <TransparentButton
          onClick={this.handleToggleSelectedPublicationsDialog}
          gaCategory="SelectedPublications"
          content="Customize List"
          icon="PEN"
          iconStyle={{
            marginRight: "8px",
            width: "18px",
            height: "18px",
          }}
        />
      );
    }
    return null;
  };

  private getRightBoxContent = () => {
    const { author, currentUser } = this.props;

    if (currentUser.author_id === author.id) {
      return (
        <TransparentButton
          style={{
            height: "36px",
            fontWeight: "bold",
            padding: "0 16px 0 8px",
          }}
          iconStyle={{
            marginRight: "8px",
            width: "20px",
            height: "20px",
          }}
          onClick={this.handleToggleModifyProfileDialog}
          gaCategory="EditProfile"
          content="Edit Profile"
          icon="PEN"
        />
      );
    }
    return null;
  };

  private handleRemovePaper = async (paper: Paper) => {
    const { dispatch, author } = this.props;

    if (
      confirm(
        // tslint:disable-next-line:max-line-length
        "Do you REALLY want to remove this paper from your publication list?\nThis will also delete it from your 'Selected Publications'."
      )
    ) {
      await dispatch(removePaperFromPaperList(author.id, paper));
    }
  };

  private handleOpenAllPublicationsDialog = () => {
    const { dispatch } = this.props;

    dispatch(openAddPublicationsToAuthorDialog());
  };

  private getFosList = () => {
    const { author } = this.props;

    if (author.fosList && author.fosList.length > 0) {
      const fosList = author.fosList.map(fos => {
        return <Keyword fos={fos} key={fos.id} />;
      });

      return (
        <div className={styles.fosListWrapper}>
          <div className={styles.fosHeader}>Top Field Of Study</div>
          <div className={styles.fosList}>{fosList}</div>
        </div>
      );
    }
    return null;
  };

  private handleSubmitUpdateSelectedPapers = (papers: Paper[]) => {
    const { dispatch, author } = this.props;

    dispatch(
      succeedToUpdateAuthorSelectedPaperList({
        authorId: author.id,
        papers,
      })
    );
  };

  private handleSubmitProfile = async (profile: ModifyProfileFormState) => {
    const { dispatch, author } = this.props;

    let affiliationId: number | null = null;
    if ((profile.currentAffiliation as Affiliation).name) {
      affiliationId = (profile.currentAffiliation as Affiliation).id;
    } else if ((profile.currentAffiliation as SuggestAffiliation).keyword) {
      affiliationId = (profile.currentAffiliation as SuggestAffiliation).affiliation_id;
    }

    try {
      await dispatch(
        updateAuthor({
          authorId: author.id,
          bio: profile.bio || null,
          email: profile.email,
          name: profile.authorName,
          webPage: profile.website || null,
          affiliationId,
        })
      );
      this.setState(prevState => ({ ...prevState, isOpenModifyProfileDialog: false }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to update user profile.",
      });
      dispatch(ActionCreators.failedToUpdateProfileData());
    }
  };

  private handleToggleModifyProfileDialog = () => {
    const { isOpenModifyProfileDialog } = this.state;

    this.setState(prevState => ({ ...prevState, isOpenModifyProfileDialog: !isOpenModifyProfileDialog }));
  };

  private handleToggleSelectedPublicationsDialog = () => {
    const { isOpenSelectedPaperDialog } = this.state;

    this.setState(prevState => ({ ...prevState, isOpenSelectedPaperDialog: !isOpenSelectedPaperDialog }));
  };

  private getCoAuthorList = () => {
    const { coAuthors } = this.props;

    if (coAuthors && coAuthors.length > 0) {
      const coAuthorList = coAuthors.map(author => {
        return <CoAuthor key={author.id} author={author} />;
      });

      return (
        <div>
          <div className={styles.coAuthorHeader}>Co-authors</div>
          {coAuthorList}
        </div>
      );
    }
    return null;
  };

  private handleSubmitPublicationSearch = (query: string) => {
    const { dispatch, authorShow, author } = this.props;

    dispatch(
      fetchAuthorPapers({
        query,
        authorId: author.id,
        sort: authorShow.papersSort,
        page: 1,
        cancelToken: this.cancelToken.token,
      })
    );
  };

  private handleClickSort = (option: AUTHOR_PAPER_LIST_SORT_TYPES) => {
    const { dispatch, authorShow, author } = this.props;

    dispatch(
      fetchAuthorPapers({
        authorId: author.id,
        sort: option,
        page: authorShow.papersCurrentPage,
        cancelToken: this.cancelToken.token,
      })
    );
  };

  private fetchPapers = (page: number, sort?: AUTHOR_PAPER_LIST_SORT_TYPES) => {
    const { dispatch, authorShow, author } = this.props;

    dispatch(
      fetchAuthorPapers({
        authorId: author.id,
        sort: sort || authorShow.papersSort,
        page,
        cancelToken: this.cancelToken.token,
      })
    );
  };

  private getAllPublications = () => {
    const { authorShow, papers, currentUser } = this.props;

    if (authorShow.isLoadingPapers) {
      return <ArticleSpinner style={{ margin: "170px auto" }} />;
    }

    if (papers && papers.length > 0) {
      return papers.map(paper => {
        return (
          <PaperItem
            key={paper.id}
            refererSection="connected_author_all_papers"
            paper={paper}
            currentUser={currentUser}
            omitAbstract={true}
            hasRemoveButton={true}
            handleRemovePaper={this.handleRemovePaper}
          />
        );
      });
    }

    return (
      <div className={styles.noPaperWrapper}>
        <Icon icon="UFO" className={styles.ufoIcon} />
        <div className={styles.noPaperDescription}>There is no publications.</div>
      </div>
    );
  };

  private getSelectedPapers = () => {
    const { author } = this.props;

    if (author.selectedPapers && author.selectedPapers.length > 0) {
      return author.selectedPapers.map(paper => {
        return (
          <PaperItem
            refererSection="connected_author_show_selected_papers"
            key={paper.id}
            paper={paper}
            omitAbstract={true}
            omitButtons={true}
          />
        );
      });
    }

    return (
      <div className={styles.noPaperWrapper}>
        <Icon icon="UFO" className={styles.ufoIcon} />
        <div className={styles.noPaperDescription}>There is no selected publications.</div>
      </div>
    );
  };

  private makeStructuredData = () => {
    const { author, coAuthors } = this.props;

    const affiliationName = author.lastKnownAffiliation ? author.lastKnownAffiliation.name : "";
    const colleagues = coAuthors.map(coAuthor => {
      if (!coAuthor) {
        return null;
      }
      const coAuthorAffiliation = coAuthor.lastKnownAffiliation ? coAuthor.lastKnownAffiliation.name : "";
      return {
        "@context": "http://schema.org",
        "@type": "Person",
        name: coAuthor.name,
        affiliation: {
          name: coAuthorAffiliation,
        },
        description: `${coAuthorAffiliation ? `${coAuthorAffiliation},` : ""} citation: ${
          coAuthor.citationCount
        }, h-index: ${coAuthor.hIndex}`,
        mainEntityOfPage: "https://scinapse.io",
      };
    });

    const structuredData: any = {
      "@context": "http://schema.org",
      "@type": "Person",
      name: author.name,
      affiliation: {
        name: affiliationName,
      },
      colleague: colleagues,
      description: `${affiliationName ? `${affiliationName},` : ""} citation: ${author.citationCount}, h-index: ${
        author.hIndex
      }`,
      mainEntityOfPage: "https://scinapse.io",
    };

    return structuredData;
  };

  private getPageHelmet = () => {
    const { author } = this.props;

    const affiliationName = author.lastKnownAffiliation ? author.lastKnownAffiliation.name : "";
    const description = `${affiliationName ? `${affiliationName},` : ""} citation: ${author.citationCount}, h-index: ${
      author.hIndex
    }`;

    return (
      <Helmet>
        <title>{author.name}</title>
        <meta itemProp="name" content={`${author.name} | Sci-napse | Academic search engine for paper`} />
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:card" content={`${author.name} | Sci-napse | Academic search engine for paper`} />
        <meta name="twitter:title" content={`${author.name} | Sci-napse | Academic search engine for paper`} />
        <meta property="og:title" content={`${author.name} | Sci-napse | Academic search engine for paper`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://scinapse.io/authors/${author.id}`} />
        <meta property="og:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(this.makeStructuredData())}</script>
      </Helmet>
    );
  };
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    authorShow: state.connectedAuthorShow,
    author: denormalize(state.connectedAuthorShow.authorId, authorSchema, state.entities),
    coAuthors: denormalize(state.connectedAuthorShow.coAuthorIds, [authorSchema], state.entities),
    papers: denormalize(state.connectedAuthorShow.paperIds, [paperSchema], state.entities),
    configuration: state.configuration,
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(ConnectedAuthorShow);
