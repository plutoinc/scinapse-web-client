import * as React from "react";
import * as classNames from "classnames";
import * as store from "store";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Picker } from "emoji-mart";
import { withStyles } from "../../../helpers/withStylesHelper";
import { BaseEmoji } from "emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index";
import { Filter } from "../../../api/member";
import { ArticleSearchState } from "../../../components/articleSearch/records";
import FilterSaveButton from "../../../components/filterContainer/filterSaveButton";
import FilterResetButton from "../../../components/filterContainer/filterResetButton";
import ScinapseInput from "../../../components/common/scinapseInput";
import alertToast from "../../../helpers/makePlutoToastAction";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import Icon from "../../../icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
const styles = require("./filterSaveBox.scss");

interface TitleBoxProps {
  hasFilterChanged: boolean;
  isDropdownOpen: boolean;
  onClickDropdownOpen: (value: React.SetStateAction<boolean>) => void;
  onClickSaveBtn: (changedFilterReq: Filter | string) => void;
  onClickFilterItem: (query: string, sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS, filter: Filter | null) => void;
  articleSearchState: ArticleSearchState;
}

const FilterTitleBox: React.FunctionComponent<TitleBoxProps & RouteComponentProps<any>> = props => {
  const {
    hasFilterChanged,
    onClickSaveBtn,
    onClickFilterItem,
    onClickDropdownOpen,
    articleSearchState,
    isDropdownOpen,
  } = props;
  const { savedFilterSet, searchInput, sort, isFilterSaveBoxLoading } = articleSearchState;

  const [isOpenTitleInput, setIsOpenTitleInput] = React.useState(false);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = React.useState(false);
  const [filterTitle, setFilterTitle] = React.useState("");

  const rawQueryParamsObj = getQueryParamsObject(props.location.search);
  const currentFilterStr = rawQueryParamsObj.filter;

  function getSaveAndResetBtns(currentFilterStr: string) {
    const currentSavedFilterStr = !!savedFilterSet ? savedFilterSet.filter : "";

    return hasFilterChanged ? (
      <div className={styles.titleBtnWrapper}>
        <FilterSaveButton
          text={!!savedFilterSet ? "Save Changes" : "+ Save this Filter"}
          onClickButton={() => {
            onClickSaveBtn(currentFilterStr);
          }}
        />
        <FilterResetButton
          currentSavedFilterSet={currentSavedFilterStr}
          btnStyle={{ position: "relative", top: "1px", marginLeft: "8px" }}
        />
      </div>
    ) : (
      <>
        {!!store.get("previousFilter") && savedFilterSet === null ? (
          <FilterSaveButton
            text="Apply previous Filter"
            buttonStyle={{
              textDecoration: "underline",
              float: "right",
              marginRight: "16px",
            }}
            onClickButton={() => {
              onClickFilterItem(searchInput, sort, store.get("previousFilter"));
            }}
          />
        ) : null}
        <Icon
          className={classNames({
            [styles.downArrow]: !isDropdownOpen,
            [styles.upArrow]: isDropdownOpen,
          })}
          icon="ARROW_POINT_TO_UP"
        />
      </>
    );
  }

  function getInnerContent(savedFilterSet: Filter | null) {
    if (!savedFilterSet) {
      return (
        <>
          {isFilterSaveBoxLoading ? (
            <div className={styles.buttonSpinnerWrapper}>
              <CircularProgress size={14} thickness={4} color="inherit" className={styles.buttonSpinner} />
            </div>
          ) : (
            <Icon className={styles.filterResultButton} icon="FILTER_RESULT_BUTTON" />
          )}
          <span
            className={classNames({
              [styles.filterContainerTitle]: !isFilterSaveBoxLoading,
              [styles.loadingFilterContainerTitle]: isFilterSaveBoxLoading,
            })}
          >
            PAPER FILTERS
          </span>
        </>
      );
    } else {
      return (
        <div>
          {isFilterSaveBoxLoading ? (
            <div className={styles.buttonSpinnerWrapper}>
              <CircularProgress size={14} thickness={4} color="inherit" className={styles.buttonSpinner} />
            </div>
          ) : (
            <span
              className={styles.filterContainerEmoji}
              onClick={e => {
                e.stopPropagation();
                onClickDropdownOpen(false);
                setIsOpenEmojiPicker(!isOpenEmojiPicker);
              }}
            >
              {savedFilterSet.emoji}
            </span>
          )}
          <span
            className={classNames({
              [styles.filterContainerTitle]: !isFilterSaveBoxLoading,
              [styles.loadingFilterContainerTitle]: isFilterSaveBoxLoading,
            })}
          >
            {savedFilterSet.name}
          </span>
          <span
            onClick={e => {
              e.stopPropagation();
              setIsOpenTitleInput(!isOpenTitleInput);
            }}
            className={styles.titleControlIconWrapper}
          >
            <Icon icon="PEN" className={styles.titleControlIcon} />
          </span>
        </div>
      );
    }
  }

  function getEditTitleBox(savedFilterSet: Filter | null) {
    if (!savedFilterSet) {
      return null;
    } else {
      return (
        <>
          <span className={styles.filterContainerEmoji}>{savedFilterSet.emoji}</span>
          <ScinapseInput
            placeholder="Write a Name for this filter"
            wrapperStyle={{ position: "absolute", display: "inline-flex", height: "100%", top: 0 }}
            onChange={e => {
              setFilterTitle(e.currentTarget.value);
            }}
            value={savedFilterSet.name}
            inputStyle={{
              width: "200px",
              fontSize: "14px",
              border: "none",
              padding: "8px 0 8px 0px",
              borderRadius: 0,
              borderBottom: "1px solid #bbc2d0",
            }}
          />
          <div className={styles.titleBtnWrapper}>
            <FilterSaveButton
              text="+ Save"
              buttonStyle={{ top: "13px", right: "58px" }}
              onClickButton={() => {
                onClickSaveBtn({ ...savedFilterSet, name: filterTitle });
                setIsOpenTitleInput(!isOpenTitleInput);
              }}
            />
            <span
              onClick={e => {
                setIsOpenTitleInput(!isOpenTitleInput);
              }}
              className={styles.titleInputCancelBtn}
            >
              cancel
            </span>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div className={styles.filterTitleBox}>
        {isOpenTitleInput ? (
          getEditTitleBox(props.articleSearchState.savedFilterSet)
        ) : (
          <div
            onClick={() => {
              onClickDropdownOpen(!isDropdownOpen);
            }}
          >
            {getInnerContent(props.articleSearchState.savedFilterSet)}
            {getSaveAndResetBtns(currentFilterStr)}
          </div>
        )}
      </div>
      {isOpenEmojiPicker ? (
        <ClickAwayListener
          onClickAway={() => {
            setIsOpenEmojiPicker(false);
          }}
        >
          <Picker
            set="emojione"
            onSelect={(emoji: BaseEmoji) => {
              if (!!props.articleSearchState.savedFilterSet) {
                console.log(emoji.native);
                // props.onClickSaveBtn({ ...props.articleSearchState.savedFilterSet, emoji: emoji.native });
                // setIsOpenEmojiPicker(!isOpenEmojiPicker);
              } else {
                alertToast({ type: "error", message: "Had an error to update emoji" });
              }
            }}
            style={{
              position: "absolute",
              zIndex: 9,
              boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
            }}
          />
        </ClickAwayListener>
      ) : null}
    </>
  );
};

export default withRouter(withStyles<typeof FilterTitleBox>(styles)(FilterTitleBox));
