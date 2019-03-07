import * as React from "react";
import * as classNames from "classnames";
import { debounce } from "lodash";
import { History } from "history";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Fos } from "../../../model/fos";
import Icon from "../../../icons";
import InputWithSuggestionList from "../../common/InputWithSuggestionList";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { ACTION_TYPES, ActionCreators } from "../../../actions/actionTypes";
import { CompletionKeyword } from "../../../api/completion";
import { getKeywordCompletion } from "../../layouts/actions";
import EnvChecker from "../../../helpers/envChecker";
const s = require("./betterSearch.scss");

interface BetterSearchProps {
  FOSList: Fos[];
  suggestionKeywords: CompletionKeyword[];
  isAnimated: boolean;
  paperId: number;
  dispatch: Dispatch<any>;
}

function handleSubmitQuery(query: string, dispatch: Dispatch<any>, history: History) {
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
    actionArea: "betterThanGoogle",
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
}

function getSuggestionKeywords(dispatch: Dispatch<any>, query: string) {
  dispatch(getKeywordCompletion(query));
}

const lazilyGetSuggestionKeywords = debounce(getSuggestionKeywords, 200);

const BetterSearch: React.FunctionComponent<BetterSearchProps & RouteComponentProps<any>> = props => {
  const [isClient, setIsClient] = React.useState(false);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const [isFromGoogle, setIsFromGoogle] = React.useState(false);
  const titleNode = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!EnvChecker.isOnServer()) {
      setIsClient(true);
    }
  }, []);

  React.useEffect(
    () => {
      if (isClient && document.referrer.includes("google")) {
        setIsFromGoogle(true);
      }
    },
    [isClient]
  );

  React.useEffect(
    () => {
      if (isFromGoogle && !props.isAnimated) {
        setShouldAnimate(true);
      }
    },
    [isFromGoogle]
  );

  React.useEffect(
    () => {
      return () => {
        props.dispatch(ActionCreators.animateBetterSearchTitle());
      };
    },
    [props.paperId]
  );

  const placeholderWord = props.FOSList.length > 0 ? props.FOSList[0].fos : "";
  const fosList = props.FOSList.slice(0, 3).map((fos, i) => {
    return (
      <a
        key={i}
        className={s.fosItem}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: "paperShow",
            actionType: "fire",
            actionArea: "fosSuggestion",
            actionTag: "fos",
            actionLabel: String(fos.id),
          });
          handleSubmitQuery(fos.fos, props.dispatch, props.history);
        }}
      >
        {i === 2 ? fos.fos : `${fos.fos}, `}
      </a>
    );
  });

  if (!isClient || !isFromGoogle) return null;

  return (
    <div className={s.wrapper}>
      <div
        ref={titleNode}
        className={classNames({
          [s.smallTitle]: !isFromGoogle || props.isAnimated,
          [s.title]: isFromGoogle && !props.isAnimated,
          [s.animatedTitle]: isFromGoogle && shouldAnimate && !props.isAnimated,
        })}
      >
        <div>Trust Me.</div>
        <div>Better than Google Scholar 😎</div>
      </div>
      <InputWithSuggestionList
        onChange={e => {
          const { value } = e.currentTarget;
          if (value.length > 1) {
            lazilyGetSuggestionKeywords(props.dispatch, value);
          }
        }}
        placeholder={`Try search ${placeholderWord}`}
        onSubmitQuery={(q: string) => {
          handleSubmitQuery(q, props.dispatch, props.history);
        }}
        suggestionList={props.suggestionKeywords.map(keyword => keyword.keyword).slice(0, 3)}
        wrapperClassName={s.searchWrapper}
        style={{
          display: "flex",
          width: "100%",
          height: "51px",
          border: 0,
          borderRadius: "4px",
          padding: "0 51px 0 16px",
          backgroundColor: "white",
          overflow: "hidden",
          alignItems: "center",
        }}
        listWrapperStyle={{
          position: "relative",
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px 1px",
        }}
        listItemStyle={{
          height: "51px",
          lineHeight: "51px",
          padding: "0 18px",
        }}
        iconNode={<Icon icon="SEARCH_ICON" className={s.searchIcon} />}
      />
      <div className={s.fosSection}>
        <span className={s.fosListTitle}>{`Or are you looking for ... `}</span>
        <span className={s.fosList}>{fosList}</span>
      </div>
    </div>
  );
};

export default withRouter(connect()(withStyles<typeof BetterSearch>(s)(BetterSearch)));
