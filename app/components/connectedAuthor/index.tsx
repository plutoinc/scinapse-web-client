import * as React from "react";
import { Helmet } from "react-helmet";
import { denormalize } from "normalizr";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { Configuration } from "../../reducers/configuration";
import { CurrentUser } from "../../model/currentUser";
import { authorSchema, Author } from "../../model/author/author";
import { Paper, paperSchema } from "../../model/paper";
import ArticleSpinner from "../common/spinner/articleSpinner";
import ScinapseInput from "../common/scinapseInput";
import { LayoutState } from "../../components/layouts/records";
import Footer from "../../components/layouts/footer";
import { AuthorShowState } from "../../containers/authorShow/reducer";
import Icon from "../../icons";
import PaperItem from "../common/paperItem";
import DesktopPagination from "../common/desktopPagination";
import CoAuthor from "../common/coAuthor";
import { fetchAuthorPapers } from "../../containers/authorShow/sideEffect";
import SelectedPublicationsDialog from "../dialog/components/selectedPublications";
import SortBox, { PAPER_LIST_SORT_TYPES } from "../common/sortBox";
import TransparentButton from "../common/transparentButton";
import ModifyProfile, { ModifyProfileFormState } from "../dialog/components/modifyProfile";
import { Affiliation } from "../../model/affiliation";
import { SuggestAffiliation } from "../../api/suggest";
import { updateAuthor } from "../../actions/author";
import PlutoAxios from "../../api/pluto";
import { ActionCreators } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";
const styles = require("./connectedAuthor.scss");

export interface ConnectedAuthorShowMatchParams {
  authorId: string;
}

interface ConnectedAuthorShowMatchState {
  isOpenSelectedPaperDialog: boolean;
  isOpenModifyProfileDialog: boolean;
}

export interface ConnectedAuthorShowPageProps extends RouteComponentProps<ConnectedAuthorShowMatchParams> {
  layout: LayoutState;
  author: Author | null;
  coAuthors: Author[];
  papers: Paper[];
  authorShow: AuthorShowState;
  configuration: Configuration;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    authorShow: state.authorShow,
    author: denormalize(state.authorShow.authorId, authorSchema, state.entities),
    coAuthors: denormalize(state.authorShow.coAuthorIds, [authorSchema], state.entities),
    papers: denormalize(state.authorShow.paperIds, [paperSchema], state.entities),
    configuration: state.configuration,
    currentUser: state.currentUser,
  };
}

@withStyles<typeof ConnectedAuthorShow>(styles)
class ConnectedAuthorShow extends React.PureComponent<ConnectedAuthorShowPageProps, ConnectedAuthorShowMatchState> {
  public constructor(props: ConnectedAuthorShowPageProps) {
    super(props);

    this.state = {
      isOpenSelectedPaperDialog: false,
      isOpenModifyProfileDialog: false,
    };
  }

  public render() {
    const { author, authorShow } = this.props;
    const { isOpenModifyProfileDialog, isOpenSelectedPaperDialog } = this.state;

    if (!author) {
      return null;
    }

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
          <div className={styles.headerBox}>
            <div className={styles.container}>
              <div className={styles.leftContentWrapper}>
                <span className={styles.nameImgBoxWrapper}>
                  <div className={styles.imgBox}>{author.name.slice(0, 1).toUpperCase()}</div>
                </span>
                <span className={styles.nameHeaderBox}>
                  <div className={styles.username}>{author.name}</div>
                  <div className={styles.affiliation}>
                    {author.lastKnownAffiliation ? author.lastKnownAffiliation.name || "" : ""}
                  </div>
                  <div className={styles.metricInformation}>
                    <span className={styles.metricValue}>{author.paperCount || ""}</span>
                    <span className={styles.metricLabel}>Publications</span>
                    <span className={styles.metricValue}>{author.hIndex || ""}</span>
                    <span className={styles.metricLabel}>H-index</span>
                    <span className={styles.metricValue}>{author.citationCount || ""}</span>
                    <span className={styles.metricLabel}>Citations</span>
                  </div>
                  <div className={styles.rightBox}>
                    <TransparentButton
                      style={{
                        height: "36px",
                        fontWeight: "bold",
                        padding: "0 16px 0 8px",
                      }}
                      iconStyle={{
                        marginRight: "8px",
                      }}
                      onClick={this.handleToggleModifyProfileDialog}
                      gaCategory="EditProfile"
                      content="Edit Profile"
                      icon="PEN"
                    />
                  </div>
                </span>
                <div className={styles.bioSection}>{author.bio || ""}</div>
                <div className={styles.contactSection}>
                  <span className={styles.contactIconWrapper}>
                    <Icon icon="EMAIL_ICON" className={styles.emailIcon} />
                  </span>
                  <span>scshinjr@gmail.com</span>
                  <span className={styles.contactIconWrapper}>
                    <Icon icon="EXTERNAL_SOURCE" className={styles.externalSource} />
                  </span>
                  <span>{`https://tylorsh.in`}</span>
                </div>
                <div className={styles.tabNavigationWrapper}>
                  <span className={styles.tabNavigationItem}>PUBLICATIONS</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contentBox}>
            <div className={styles.container}>
              <div className={styles.leftContentWrapper}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>Selected Publications</span>
                  <span className={styles.countBadge}>{author.selectedPapers.length}</span>
                  <div className={styles.rightBox}>
                    <TransparentButton
                      onClick={this.handleToggleSelectedPublicationsDialog}
                      gaCategory="SelectedPublications"
                      content="Customize List"
                      icon="PEN"
                    />
                  </div>
                </div>
                <div className={styles.selectedPaperDescription}>
                  Selected Publications are representative papers selected by the author.
                </div>
                {this.getSelectedPapers()}

                <div className={styles.allPublicationHeader}>
                  <span className={styles.sectionTitle}>All Publications</span>
                  <span className={styles.countBadge}>{author.paperCount}</span>
                </div>
                <div className={styles.selectedPaperDescription}>
                  All Publications are all papers published by this author.
                </div>
                <div className={styles.searchSortWrapper}>
                  <ScinapseInput
                    placeholder="Search paper by keyword"
                    icon="SEARCH_ICON"
                    wrapperStyle={{
                      borderRadius: "4px",
                      border: "solid 1px #f1f3f6",
                      backgroundColor: "#f9f9fa",
                      width: "319px",
                      height: "36px",
                    }}
                  />
                  <div className={styles.rightBox}>
                    <SortBox
                      sortOption={"MOST_CITATIONS"}
                      handleClickSortOption={(option: PAPER_LIST_SORT_TYPES) => {
                        console.log(option);
                      }}
                      exposeRelevanceOption={false}
                    />
                  </div>
                </div>
                {this.getAllPublications()}
                <DesktopPagination
                  type="AUTHOR_SHOW_PAPERS_PAGINATION"
                  totalPage={authorShow.papersTotalPage}
                  currentPageIndex={authorShow.papersCurrentPage - 1}
                  onItemClick={this.handleClickPagination}
                  wrapperStyle={{
                    margin: "45px 0 40px 0",
                  }}
                />
              </div>
              <div className={styles.rightContentWrapper}>
                <div className={styles.coAuthorHeader}>Co-authors</div>
                {this.getCoAuthorList()}
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <SelectedPublicationsDialog
          isOpen={isOpenSelectedPaperDialog}
          author={author}
          handleClose={this.handleToggleSelectedPublicationsDialog}
        />
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

  private handleSubmitProfile = async (profile: ModifyProfileFormState) => {
    const { dispatch, author } = this.props;

    if (author) {
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
      return coAuthors.map(author => {
        return <CoAuthor key={author.id} author={author} />;
      });
    }
    return null;
  };

  private handleClickPagination = (page: number) => {
    const { dispatch, authorShow, author } = this.props;

    if (author) {
      dispatch(
        fetchAuthorPapers({
          authorId: author.id,
          sort: authorShow.papersSort,
          page,
        })
      );
    }
  };

  private getAllPublications = () => {
    const { papers, currentUser } = this.props;

    if (papers) {
      return papers.map(paper => {
        return <PaperItem key={paper.id} paper={paper} currentUser={currentUser} omitAbstract={true} />;
      });
    }
    return null;
  };

  private getSelectedPapers = () => {
    const { author } = this.props;

    if (author) {
      return author.selectedPapers.map(paper => {
        return <PaperItem key={paper.id} paper={paper} omitAbstract={true} omitButtons={true} />;
      });
    }
    return null;
  };

  private makeStructuredData = () => {
    const { author, coAuthors } = this.props;

    if (author) {
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
    }
  };

  private getPageHelmet = () => {
    const { author } = this.props;

    if (author) {
      const affiliationName = author.lastKnownAffiliation ? author.lastKnownAffiliation.name : "";
      const description = `${affiliationName ? `${affiliationName},` : ""} citation: ${
        author.citationCount
      }, h-index: ${author.hIndex}`;

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
    }
  };
}

export default connect(mapStateToProps)(ConnectedAuthorShow);
