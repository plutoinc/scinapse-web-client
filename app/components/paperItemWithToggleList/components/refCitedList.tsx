import * as React from "react";
import axios from "axios";
import * as classNames from "classnames";
import PaperAPI, { GetReferenceOrCitedPapersResult } from "../../../api/paper";
import { Paper } from "../../../model/paper";
import BasePaperItem from "./basePaperItem";
import { RefCitedListProps, TrackingProps } from "../types";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import PlutoAxios from "../../../api/pluto";
import ArticleSpinner from "../../common/spinner/articleSpinner";
const s = require("./refCitedList.scss");

interface RefCitedListState {
  isOpen: boolean;
  isLoading: boolean;
  errorMsg: string;
  hasFetched: boolean;
  paperList: Paper[];
}

interface RefCitedListAction {
  type: string;
  payload?: any;
}

const initialState = {
  isOpen: false,
  isLoading: false,
  errorMsg: "",
  hasFetched: false,
  paperList: [],
};

export const reducer: React.Reducer<RefCitedListState, RefCitedListAction> = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isOpen: true,
        hasFetched: true,
        errorMsg: "",
      };

    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        errorMsg: "",
        paperList: action.payload && action.payload.paperList,
      };

    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        errorMsg: action.payload && action.payload.errorMsg ? action.payload.errorMsg : "Something went wrong",
      };

    case "TOGGLE_BUTTON":
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    default:
      throw new Error();
  }
};

const PaperList: React.FC<{ paperList: Paper[] } & TrackingProps> = props => {
  const content = props.paperList.slice(0, 5).map(paper => (
    <div className={s.paperItemWrapper} key={paper.id}>
      <BasePaperItem paper={paper} pageType={props.pageType} actionArea={props.actionArea} />
    </div>
  ));
  return <div className={s.paperListWrapper}>{content}</div>;
};

const RefCitedList: React.FC<RefCitedListProps & TrackingProps> = props => {
  const { type, paperId, paperCount, actionArea, pageType } = props;
  const cancelToken = React.useRef(axios.CancelToken.source());
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(
    () => {
      const token = cancelToken.current;
      return () => {
        if (token) {
          token.cancel();
        }
      };
    },
    [paperId]
  );

  async function handleClickButton() {
    if (state.hasFetched) {
      dispatch({ type: "TOGGLE_BUTTON" });
    }

    if (!state.isOpen && !state.hasFetched) {
      dispatch({ type: "FETCH_INIT" });
      if (state.paperList)
        try {
          const commonParams = {
            page: 1,
            filter: "year=:,if=:",
            paperId,
            cancelToken: cancelToken.current.token,
          };
          let res: GetReferenceOrCitedPapersResult;
          if (type === "ref") {
            res = await PaperAPI.getReferencePapers(commonParams);
          } else {
            res = await PaperAPI.getCitedPapers(commonParams);
          }

          const paperList = res.result.map(id => res.entities.papers[id]);
          dispatch({
            type: "FETCH_SUCCESS",
            payload: {
              paperList,
            },
          });
        } catch (err) {
          if (!axios.isCancel(err)) {
            const error = PlutoAxios.getGlobalError(err);
            dispatch({
              type: "FETCH_FAILURE",
              payload: {
                errorMsg: error.message,
              },
            });
          }
        }
    }
  }

  let content = null;
  if (state.isOpen && state.isLoading) {
    content = (
      <div className={s.loadingWrapper}>
        <ArticleSpinner className={s.loadingSpinner} />
      </div>
    );
  } else if (state.isOpen && state.paperList && state.paperList.length > 0) {
    content = <PaperList paperList={state.paperList} actionArea={actionArea} pageType={pageType} />;
  } else if (state.isOpen && state.paperList && state.paperList.length === 0) {
    <div>{`No ${type === "ref" ? "References" : "Citations"}`}</div>;
  }

  const btnContent = type === "ref" ? "References" : "Citations";

  return (
    <div>
      <button onClick={handleClickButton} className={s.toggleButton}>
        <Icon
          icon="ARROW_POINT_TO_UP"
          className={classNames({
            [s.arrowIcon]: !state.isOpen,
            [s.activeArrowIcon]: state.isOpen,
          })}
        />
        <span>{`${paperCount} ${btnContent}`}</span>
      </button>
      {content}
    </div>
  );
};

export default withStyles<typeof RefCitedList>(s)(RefCitedList);
