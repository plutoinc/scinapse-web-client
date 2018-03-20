import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "../articleSearch/actions";
import InputBox from "../common/inputBox/inputBox";
import { trackAndOpenLink } from "../../helpers/handleGA";
import { AppState } from "../../reducers";
import { ArticleSearchStateRecord } from "../articleSearch/records";
import { Footer } from "../layouts";
import Icon from "../../icons";
import { LayoutStateRecord } from "../layouts/records";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./home.scss");

export interface HomeProps extends DispatchProp<HomeMappedState> {
  layout: LayoutStateRecord;
  articleSearchState: ArticleSearchStateRecord;
}

export interface HomeMappedState {
  layout: LayoutStateRecord;
  articleSearchState: ArticleSearchStateRecord;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
  };
}

@withStyles<typeof Home>(styles)
class Home extends React.PureComponent<HomeProps, {}> {
  public componentDidMount() {
    this.clearSearchInput();
  }

  public render() {
    const { articleSearchState, layout } = this.props;
    const { searchInput } = articleSearchState;

    const containerStyle = this.getContainerStyle();
    const searchBoxPlaceHolder = layout.isMobile
      ? "Search papers by keyword"
      : "Search papers by title, author, doi or keyword";

    return (
      <div className={styles.articleSearchFormContainer}>
        <h1 style={{ display: "none" }}>sci-napse | Academic search engine</h1>
        <div className={styles.searchFormInnerContainer}>
          <div className={styles.searchFormContainer}>
            <div className={styles.formWrapper}>
              <div className={styles.searchTitle}>
                DO RESEARCH,<br /> NEVER RE-SEARCH
              </div>
              <form
                className={styles.searchInputForm}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  this.handleSearchPush();
                }}
              >
                <InputBox
                  onChangeFunc={this.changeSearchInput}
                  defaultValue={searchInput}
                  placeHolder={searchBoxPlaceHolder}
                  type="search"
                  className={styles.inputBox}
                  onClickFunc={this.handleSearchPush}
                />
              </form>
              <div className={styles.searchSubTitle}>
                {`Scinapse is a free, nonprofit, Academic search engine service of `}
                <a
                  href="https://pluto.network"
                  target="_blank"
                  onClick={() => {
                    trackAndOpenLink("articleSearchPlutoNetwork");
                  }}
                  className={styles.plutoNetwork}
                >
                  Pluto Network.
                </a>
              </div>
              <div className={styles.searchTryKeyword} />
            </div>
          </div>
          <div className={styles.featureWrapper}>
            <div className={styles.featureItem}>
              <Icon className={styles.iconWrapper} icon="INTUITIVE_FEED" />
              <div className={styles.itemContents}>
                <div className={styles.itemTitle}>Intuitive Feed</div>
                <div className={styles.itemDetail}>
                  Quickly skim through the search results with major indices on the authors and the article.
                </div>
              </div>
            </div>
            <div className={styles.featureItem}>
              <Icon className={styles.iconWrapper} icon="POWERED_BY_COMMUNITY" />
              <div className={styles.itemContents}>
                <div className={styles.itemTitle}>Powered by community</div>
                <div className={styles.itemDetail}>
                  Comments on the paper make it easy to find meaningful papers that can be applied to my research
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer containerStyle={containerStyle} />
      </div>
    );
  }

  private clearSearchInput = () => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(""));
  };

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));
  };

  private handleSearchPush = () => {
    const { dispatch, articleSearchState } = this.props;

    dispatch(Actions.handleSearchPush(articleSearchState.searchInput));
  };

  private getContainerStyle: () => React.CSSProperties = () => {
    const { layout } = this.props;

    if (layout.isMobile) {
      return { position: "absolute", margin: "0 0 9px 0", width: "100%" };
    }
  };
}

export default connect(mapStateToProps)(Home);
