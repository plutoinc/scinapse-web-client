import * as React from "react";
import { Helmet } from "react-helmet";
import { denormalize } from "normalizr";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps, Link } from "react-router-dom";
import DesktopPagination from "../common/desktopPagination";
import MobilePagination from "../common/mobilePagination";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { AuthorShowState } from "./reducer";
import { Configuration } from "../../reducers/configuration";
import { fetchAuthorShowPageData, fetchAuthorPapers } from "./sideEffect";
import { CurrentUser } from "../../model/currentUser";
import { authorSchema, Author } from "../../model/author/author";
import { Paper, paperSchema } from "../../model/paper";
import SortBox, { PAPER_LIST_SORT_TYPES } from "../common/sortBox";
import PaperItem from "../common/paperItem";
import { getAuthorPapers } from "./actions";
import { DEFAULT_AUTHOR_PAPERS_SIZE } from "../../api/author";
import ArticleSpinner from "../common/spinner/articleSpinner";
import HIndexBox from "../common/hIndexBox";
import { ActionCreators } from "../../actions/actionTypes";
import EnvChecker from "../../helpers/envChecker";
import { LayoutState, UserDevice } from "../layouts/records";
const styles = require("./authorShow.scss");

export interface AuthorShowMatchParams {
  authorId: string;
}

export interface HandleAuthorClaim {
  authorId: number;
}

export interface AuthorShowPageProps extends RouteComponentProps<AuthorShowMatchParams> {
  layout: LayoutState;
  author: Author;
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

@withStyles<typeof AuthorShowPage>(styles)
class AuthorShowPage extends React.PureComponent<AuthorShowPageProps, {}> {
  public componentDidMount() {
    const { dispatch, location, match, configuration, currentUser } = this.props;
    const notRenderedAtServerOrJSAlreadyInitialized = !configuration.initialFetched || configuration.clientJSRendered;

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      fetchAuthorShowPageData(
        {
          dispatch,
          match,
          pathname: location.pathname,
        },
        currentUser
      );
    }
  }

  public componentWillReceiveProps(nextProps: AuthorShowPageProps) {
    const { match, dispatch, location, currentUser } = nextProps;

    if (this.props.match.params.authorId !== nextProps.match.params.authorId) {
      fetchAuthorShowPageData(
        {
          dispatch,
          match,
          pathname: location.pathname,
        },
        currentUser
      );
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch!(ActionCreators.flushEntities());
  }

  public render() {
    const { author, authorShow, coAuthors } = this.props;

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
        <div className={styles.headerBox}>
          <div className={styles.container}>
            <div className={styles.headerFlexWrapper}>
              <div className={styles.headerLeftBox}>
                <div className={styles.authorInformation}>
                  <Link to={`/authors/${author.id}`} className={styles.authorName}>
                    {author.name}
                  </Link>
                  <div className={styles.affiliation}>
                    {author.lastKnownAffiliation ? author.lastKnownAffiliation.name : ""}
                  </div>
                </div>
                <div className={styles.metadataBox}>
                  <span className={styles.citationNumberBox}>
                    <div className={styles.citationNumberTitle}>Citations</div>
                    <div className={styles.citationNumber}>{author.citationCount}</div>
                  </span>
                  {this.getHIndexNode(author)}
                </div>
              </div>
              <div className={styles.headerRightBox}>
                <a
                  className={styles.authorClaimButton}
                  onClick={() => this.handleAuthorClaim({ authorId: this.props.author.id })}
                >
                  SUGGEST CHANGES
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentBox}>
          <div className={styles.container}>
            <div className={styles.contentFlexWrapper}>
              <div className={styles.contentLeftBox}>
                <div className={styles.paperListBox}>
                  <div className={styles.paperListHeader}>
                    <div className={styles.paperListLeft}>
                      <span className={styles.paperListTitle}>Publications</span>
                      <span className={styles.paperListTitleNumber}>{` ${author.paperCount}`}</span>
                    </div>

                    <div className={styles.paperListRight}>
                      <SortBox sortOption={authorShow.papersSort} handleClickSortOption={this.handleClickSortOption} />
                    </div>
                  </div>

                  <div className={styles.paperListContent}>{this.getPaperList()}</div>
                  {this.getPagination()}
                </div>
              </div>

              <div className={styles.contentRightBox}>
                <div className={styles.coAuthorTitleBox}>
                  <span className={styles.coAuthorListTitle}>Co-Authors</span>
                  <span className={styles.coAuthorListTitleNumber}>{` ${coAuthors.length}`}</span>
                </div>
                <div className={styles.coAuthorList}>{this.getCoAuthors()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getPagination = () => {
    const { authorShow, layout } = this.props;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return (
        <MobilePagination
          totalPageCount={authorShow.papersTotalPage}
          currentPageIndex={authorShow.papersCurrentPage - 1}
          onItemClick={this.handleClickPagination}
          wrapperStyle={{
            margin: "12px 0",
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type="AUTHOR_SHOW_PAPERS_PAGINATION"
          totalPage={authorShow.papersTotalPage}
          currentPageIndex={authorShow.papersCurrentPage - 1}
          onItemClick={this.handleClickPagination}
          wrapperStyle={{
            margin: "24px 0",
          }}
        />
      );
    }
  };

  private handleClickPagination = (page: number) => {
    const { dispatch, authorShow, author } = this.props;

    dispatch(
      fetchAuthorPapers({
        authorId: author.id,
        sort: authorShow.papersSort,
        page,
      })
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

  private getHIndexNode = (author: Author) => {
    if (!author.hIndex) {
      return null;
    }
    return (
      <span className={styles.hIndexBox}>
        <div className={styles.hIndexTitle}>H-index</div>
        <div className={styles.hIndexNumber}>{author.hIndex}</div>
      </span>
    );
  };

  private handleClickSortOption = (sortOption: PAPER_LIST_SORT_TYPES) => {
    const { dispatch, author } = this.props;

    if (author) {
      dispatch!(
        getAuthorPapers({
          authorId: author.id,
          page: 1,
          size: DEFAULT_AUTHOR_PAPERS_SIZE,
          sort: sortOption,
        })
      );
    }
  };

  private getCoAuthors = () => {
    const { coAuthors } = this.props;

    return coAuthors.map(author => {
      if (!author) {
        return null;
      }
      return (
        <div key={`author_papers_authors_${author.id}`} className={styles.authorItem}>
          <div className={styles.coAuthorItemHeader}>
            <Link to={`/authors/${author.id}`} className={styles.coAuthorName}>
              {author.name}
            </Link>
            <HIndexBox hIndex={author.hIndex} />
          </div>

          <div className={styles.coAuthorItemContent}>
            <span className={styles.coAuthorAffiliation}>
              {author.lastKnownAffiliation ? author.lastKnownAffiliation.name : ""}
            </span>
          </div>
        </div>
      );
    });
  };

  private getPaperList = () => {
    const { papers, currentUser } = this.props;

    return papers.map(paper => {
      if (paper) {
        return <PaperItem currentUser={currentUser} paper={paper} key={`author_papers_${paper.id}`} />;
      }
    });
  };

  private handleAuthorClaim = ({ authorId }: HandleAuthorClaim) => {
    const targetId = authorId;

    if (!EnvChecker.isOnServer()) {
      window.open(
        // tslint:disable-next-line:max-line-length
        `https://docs.google.com/forms/d/e/1FAIpQLSd6FqawNtamoqw6NE0Q7BYS1Pn4O0FIbK1VI_47zbRWxDzgXw/viewform?entry.1961255815=${targetId}`,
        "_blank"
      );
    }
  };
}

export default connect(mapStateToProps)(AuthorShowPage);
