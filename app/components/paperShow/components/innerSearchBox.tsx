import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { connect, Dispatch } from "react-redux";
import { debounce } from "lodash";
import { LayoutState } from "../../layouts/records";
import * as Actions from "../../layouts/actions";
import { ArticleSearchState } from "../../articleSearch/records";
import InputWithSuggestionList from "../../common/InputWithSuggestionList";
import Icon from "../../../icons";
import { AppState } from "../../../reducers";
import { Fos } from "../../../model/fos";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { withStyles } from "../../../helpers/withStylesHelper";
import SafeURIStringHandler from "../../../helpers/safeURIStringHandler";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import ActionTicketManager from "../../../helpers/actionTicketManager";
const styles = require("./innerSearchBox.scss");

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
  };
}

interface InnerSearchBoxProps extends RouteComponentProps<null> {
  layout: LayoutState;
  articleSearchState: ArticleSearchState;
  dispatch: Dispatch<any>;
  shouldRender: boolean;
  FOSList?: Fos[];
}

@withStyles<typeof InnerSearchBox>(styles)
class InnerSearchBox extends React.PureComponent<InnerSearchBoxProps> {
  public render() {
    const { shouldRender } = this.props;

    if (!shouldRender) {
      return null;
    }

    return (
      <div className={styles.innerSearchBoxWrapper}>
        <>
          <h3 className={styles.innerSearchBoxTitle}>You will get better papers this time</h3>
        </>
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
        placeholder="+2 million scholars searched in Scinapse during 2018!"
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
