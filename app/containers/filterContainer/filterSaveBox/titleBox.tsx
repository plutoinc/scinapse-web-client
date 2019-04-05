import * as React from "react";
import * as classNames from "classnames";
import * as store from "store";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Picker } from "emoji-mart";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FilterTitleInnerContent from "./titleInnerContent";
import FilterSaveButton from "../../../components/filterContainer/filterSaveButton";
import FilterResetButton from "../../../components/filterContainer/filterResetButton";
import { withStyles } from "../../../helpers/withStylesHelper";
import { BaseEmoji } from "emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index";
import { Filter } from "../../../api/member";
import { ArticleSearchState } from "../../../components/articleSearch/records";
import ScinapseInput from "../../../components/common/scinapseInput";
import alertToast from "../../../helpers/makePlutoToastAction";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import Icon from "../../../icons";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { PREVIOUS_FILTER } from "../../../components/articleSearch/constants";
const styles = require("./filterSaveBox.scss");

interface TitleBoxProps {
  hasFilterChanged: boolean;
  isDropdownOpen: boolean;
  onClickDropdownOpen: (value: React.SetStateAction<boolean>) => void;
  onClickCreateNewFilterBtn: (changedFilterReq: Filter | string) => void;
  onClickSaveChangesBtn: (changedFilterReq: Filter | string, currentSavedFilterSet: Filter) => void;
  onClickFilterItem: (query: string, sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS, filter: Filter | null) => void;
  articleSearchState: ArticleSearchState;
}

const FilterTitleBox: React.FunctionComponent<TitleBoxProps & RouteComponentProps<any>> = props => {
  const {
    hasFilterChanged,
    onClickCreateNewFilterBtn,
    onClickSaveChangesBtn,
    onClickFilterItem,
    onClickDropdownOpen,
    articleSearchState,
    isDropdownOpen,
  } = props;
  const { selectedFilter, searchInput, sort } = articleSearchState;
  const [isOpenTitleInput, setIsOpenTitleInput] = React.useState(false);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = React.useState(false);
  const [filterTitle, setFilterTitle] = React.useState("");
  const rawQueryParamsObj = getQueryParamsObject(props.location.search);
  const currentFilterStr = rawQueryParamsObj.filter;

  function getSaveAndResetBtns() {
    const currentSavedFilterStr = !!selectedFilter
      ? PapersQueryFormatter.getStringifiedPaperFilterParams(selectedFilter.filter)
      : "";

    if (hasFilterChanged) {
      return (
        <div className={styles.titleBtnWrapper}>
          <FilterSaveButton
            text={!!selectedFilter ? "Save Changes" : "+ Save this Filter"}
            onClickButton={() => {
              if (!selectedFilter) {
                onClickCreateNewFilterBtn(currentFilterStr);
                ActionTicketManager.trackTicket({
                  pageType: "searchResult",
                  actionType: "fire",
                  actionArea: "filter",
                  actionTag: "addFilter",
                  actionLabel: JSON.stringify(PapersQueryFormatter.objectifyPapersFilter(currentFilterStr)),
                });
              } else {
                onClickSaveChangesBtn(currentFilterStr, selectedFilter);
              }
            }}
          />
          <FilterResetButton
            text={!!selectedFilter ? "Cancel" : null}
            currentSavedFilterSet={currentSavedFilterStr}
            btnStyle={{ position: "relative", top: "1px", marginLeft: "8px" }}
          />
        </div>
      );
    } else {
      return (
        <>
          {!!store.get(PREVIOUS_FILTER) && selectedFilter === null ? (
            <FilterSaveButton
              text="Apply previous Filter"
              buttonStyle={{ textDecoration: "underline", float: "right", marginRight: "16px", width: "100%" }}
              onClickButton={() => {
                onClickFilterItem(searchInput, sort, store.get(PREVIOUS_FILTER));
                ActionTicketManager.trackTicket({
                  pageType: "searchResult",
                  actionType: "fire",
                  actionArea: "filter",
                  actionTag: "applyPreviousFilter",
                  actionLabel: JSON.stringify(store.get(PREVIOUS_FILTER)),
                });
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
  }

  function getEditTitleBox() {
    if (!selectedFilter) {
      return null;
    } else {
      return (
        <>
          <span className={styles.filterContainerEmoji}>{selectedFilter.emoji}</span>
          <ScinapseInput
            placeholder="Write a Name for this filter"
            wrapperStyle={{ position: "absolute", display: "inline-flex", height: "100%", top: 0 }}
            onChange={e => {
              setFilterTitle(e.currentTarget.value);
            }}
            autoFocus={true}
            value={selectedFilter.name}
            inputStyle={{
              width: "200px",
              fontSize: "14px",
              border: "none",
              padding: "8px 0 8px 0px",
              borderRadius: 0,
              borderBottom: "1px solid #bbc2d0",
            }}
          />
          <div className={styles.titleEditBtnWrapper}>
            <FilterSaveButton
              text="+ Save"
              buttonStyle={{ top: "13px", right: "58px" }}
              onClickButton={() => {
                onClickSaveChangesBtn({ ...selectedFilter, name: filterTitle }, selectedFilter);
                setIsOpenTitleInput(!isOpenTitleInput);
              }}
            />
            <span
              onClick={() => {
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
          getEditTitleBox()
        ) : (
          <div
            className={styles.filterTitleBoxWrapper}
            onClick={() => {
              onClickDropdownOpen(!isDropdownOpen);
            }}
          >
            <FilterTitleInnerContent
              articleSearchState={articleSearchState}
              hasFilterChanged={hasFilterChanged}
              hasOpenEmojiPicker={isOpenEmojiPicker}
              hasOpenTitleInput={isOpenTitleInput}
              onClickDropDownOpen={onClickDropdownOpen}
              onClickSetIsOpenEmojiPicker={setIsOpenEmojiPicker}
              onClickSetIsTitleInput={setIsOpenTitleInput}
            />
            {getSaveAndResetBtns()}
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
              if (!!articleSearchState.selectedFilter) {
                onClickSaveChangesBtn(
                  { ...articleSearchState.selectedFilter, emoji: emoji.native },
                  articleSearchState.selectedFilter
                );
                setIsOpenEmojiPicker(!isOpenEmojiPicker);
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
