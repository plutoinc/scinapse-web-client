import * as React from "react";
import { AppState } from "../../../reducers";
import { withRouter, RouteComponentProps } from "react-router";
import { connect, Dispatch } from "react-redux";
import { Fos } from "../../../model/fos";
import { withStyles } from "../../../helpers/withStylesHelper";
import { LayoutState } from "../../layouts/records";
import { ArticleSearchState } from "../../articleSearch/records";
import SafeURIStringHandler from "../../../helpers/safeURIStringHandler";
import Icon from "../../../icons";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import InputWithSuggestionList from "../../common/InputWithSuggestionList";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { debounce } from "lodash";
import * as Actions from "../../layouts/actions";
import ActionTicketManager from "../../../helpers/actionTicketManager";

const styles = require("./innerSearchBox.scss");

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
  };
}

interface InnerSearchBoxProps extends RouteComponentProps<any> {
  FOSList?: Fos[];
  layout: LayoutState;
  articleSearchState: ArticleSearchState;
  dispatch: Dispatch<any>;
}

@withStyles<typeof InnerSearchBox>(styles)
class InnerSearchBox extends React.PureComponent<InnerSearchBoxProps> {
  public constructor(props: InnerSearchBoxProps) {
    super(props);
  }

  public render() {
    return (
      <div className={styles.innerSearchBoxWrapper}>
        <h3 className={styles.innerSearchBoxTitle}>Search by Your Keyword</h3>
        {this.getSearchBox()}
        <div className={styles.fosWrapper}>
          <small className={styles.fosGuideContent}>Or are you looking for…</small>
          <ul className={styles.keywordList}>{this.getFosList()}</ul>
        </div>
      </div>
    );
  }

  private getFosList = () => {
    const { FOSList } = this.props;

    if (!FOSList || FOSList.length === 0) {
      return null;
    } else {
      const FOSNodeArray = FOSList.slice(0, 3).map((fos, index) => {
        if (fos) {
          return (
            <a
              href={`/search?${papersQueryFormatter.stringifyPapersQuery({
                query: fos.fos || "",
                sort: "RELEVANCE",
                page: 1,
                filter: {},
              })}`}
              target="_blank"
              rel="noopener"
              onClick={() => {
                ActionTicketManager.trackTicket({
                  pageType: "paperShow",
                  actionType: "fire",
                  actionArea: "fosSuggestion",
                  actionTag: "fos",
                  actionLabel: String(fos.id),
                });
              }}
              key={index}
            >
              <li className={styles.keywordItem} key={index}>
                {fos.fos}
                {index === 2 ? "" : ","}
              </li>
            </a>
          );
        }
      });
      return FOSNodeArray;
    }
  };

  private getSearchBox = () => {
    const { location, layout } = this.props;

    const rawQueryParamsObj: Scinapse.ArticleSearch.RawQueryParams = getQueryParamsObject(location.search);
    const query = SafeURIStringHandler.decode(rawQueryParamsObj.query || "");

    return (
      <InputWithSuggestionList
        defaultValue={query}
        onChange={this.changeSearchInput}
        placeholder="Search papers by title, author, doi or keyword"
        handleSubmit={this.handleSearchPush}
        suggestionList={layout.completionKeywordList.map(keyword => keyword.keyword).slice(0, 3)}
        wrapperClassName={styles.searchWrapper}
        style={{
          display: "flex",
          width: "100%",
          height: "44px",
          border: 0,
          borderRadius: "4px",
          padding: "0 44px 0 16px",
          backgroundColor: "white",
          overflow: "hidden",
          alignItems: "center",
        }}
        listWrapperStyle={{
          position: "relative",
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px 1px",
        }}
        listItemStyle={{
          height: "44px",
          lineHeight: "44px",
          padding: "0 18px",
        }}
        iconNode={<Icon icon="SEARCH_ICON" className={styles.searchIcon} />}
      />
    );
  };

  private getKeywordCompletion = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.getKeywordCompletion(searchInput));
  };

  // tslint:disable-next-line:member-ordering
  private delayedGetKeywordCompletion = debounce(this.getKeywordCompletion, 200);

  private changeSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (value.length > 1) {
      this.delayedGetKeywordCompletion(value);
    }
  };

  private handleSearchPush = (query: string) => {
    const { dispatch, history } = this.props;

    if (query.length < 2) {
      return dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: "error",
          message: "You should search more than 2 characters.",
        },
      });
    }

    ActionTicketManager.trackTicket({
      pageType: "paperShow",
      actionType: "fire",
      actionArea: "innerSearchBox",
      actionTag: "query",
      actionLabel: query,
    });

    history.push(
      `/search?${papersQueryFormatter.stringifyPapersQuery({
        query,
        sort: "RELEVANCE",
        filter: {},
        page: 1,
      })}`
    );
  };
}

export default withRouter(connect(mapStateToProps)(InnerSearchBox));
