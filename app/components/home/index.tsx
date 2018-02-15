import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "../articleSearch/actions";
import { InputBox } from "../common/inputBox/inputBox";
import { trackAndOpenLink } from "../../helpers/handleGA";
import { IAppState } from "../../reducers";
import { IArticleSearchStateRecord } from "../articleSearch/records";
import { Footer } from "../layouts";
import Icon from "../../icons";
import { ILayoutStateRecord } from "../layouts/records";
const styles = require("./home.scss");

export interface IHomeProps extends DispatchProp<IHomeMappedState> {
  layout: ILayoutStateRecord;
  articleSearchState: IArticleSearchStateRecord;
}

export interface IHomeMappedState {
  layout: ILayoutStateRecord;
  articleSearchState: IArticleSearchStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
  };
}

class Home extends React.PureComponent<IHomeProps, {}> {
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

  public render() {
    const { articleSearchState } = this.props;
    const { searchInput } = articleSearchState;

    const containerStyle = this.getContainerStyle();

    return (
      <div className={styles.articleSearchFormContainer}>
        <div className={styles.searchFormInnerContainer}>
          <div className={styles.searchFormContainer}>
            <div className={styles.formWrapper}>
              <div className={styles.searchTitle}>Do research, never re-search</div>
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
                  placeHolder="Search papers"
                  type="search"
                  className={styles.inputBox}
                  onClickFunc={this.handleSearchPush}
                />
              </form>
              <div className={styles.searchSubTitle}>
                {`PLUTO beta service is a free, nonprofit, academic discovery service of `}
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
            </div>
          </div>
          <div className={styles.infoList}>
            <div className={styles.infoBox}>
              <Icon className={styles.iconWrapper} icon="INTUITIVE_FEED" />
              <div className={styles.infoContent}>
                <div className={styles.title}>Intuitive Feed</div>
                <div className={styles.content}>
                  Quickly skim through the search results with major indices on the authors and the article.
                </div>
              </div>
            </div>
            <div className={styles.infoBox}>
              <Icon className={styles.iconWrapper} icon="POWERED_BY_COMMUNITY" />
              <div className={styles.infoContent}>
                <div className={styles.title}>Powered by community</div>
                <div className={styles.content}>
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
}

export default connect(mapStateToProps)(Home);
