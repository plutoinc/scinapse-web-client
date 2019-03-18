import * as React from "react";
import * as store from "store";
import * as classNames from "classnames";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { Picker } from "emoji-mart";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { isEqual, findIndex } from "lodash";
import { BaseEmoji } from "emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index";
import { withStyles } from "../../../helpers/withStylesHelper";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { ArticleSearchState } from "../../../components/articleSearch/records";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import FilterResetButton from "../../../components/filterContainer/filterResetButton";
import FilterSaveButton from "../../../components/filterContainer/filterSaveButton";
import { setSavedFilterSet, putMyFilters } from "../../../components/articleSearch/actions";
import { Filter } from "../../../api/member";
import alertToast from "../../../helpers/makePlutoToastAction";
import SavedFilterItem from "../savedFilterItem";
import ScinapseInput from "../../../components/common/scinapseInput";
import Icon from "../../../icons";
import makeNewFilterSetTitle from "../../../helpers/makeNewFilterSetTitle";
const styles = require("./filterSaveBox.scss");

interface FilterSaveBoxProps {
  articleSearchState: ArticleSearchState;
  dispatch: Dispatch<any>;
}

function handleClickSaveButton(changedFilter: Filter | any, props: FilterSaveBoxProps) {
  const { articleSearchState, dispatch } = props;
  const { savedFilterSet, myFilters } = articleSearchState;
  const changedFilterIndex = savedFilterSet ? findIndex(myFilters, savedFilterSet) : undefined;

  const newFilters =
    changedFilterIndex !== undefined && changedFilterIndex >= 0
      ? [
          changedFilter,
          ...myFilters.slice(0, changedFilterIndex),
          ...myFilters.slice(changedFilterIndex + 1, myFilters.length),
        ]
      : [changedFilter, ...myFilters];

  dispatch(putMyFilters(newFilters));
  dispatch(setSavedFilterSet(changedFilter));
}

function handleClickDeleteButton(props: FilterSaveBoxProps, deleteIndex: number) {
  const { articleSearchState, dispatch } = props;
  const { savedFilterSet, myFilters } = articleSearchState;

  const newFilters = [...myFilters.slice(0, deleteIndex), ...myFilters.slice(deleteIndex + 1, myFilters.length)];

  dispatch(putMyFilters(newFilters));
  dispatch(setSavedFilterSet(!!savedFilterSet ? savedFilterSet : null));
}

const FilterSaveBox: React.FunctionComponent<FilterSaveBoxProps & RouteComponentProps<any>> = props => {
  const { articleSearchState, dispatch, history } = props;
  const { savedFilterSet, searchInput, sort } = articleSearchState;

  let popoverAnchorEl: HTMLDivElement | null;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChange, setIsChange] = React.useState(false);
  const [isOpenTitleInput, setIsOpenTitleInput] = React.useState(false);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = React.useState(false);
  const [filterTitle, setFilterTitle] = React.useState("");

  const rawQueryParamsObj: Scinapse.ArticleSearch.RawQueryParams = getQueryParamsObject(location.search);

  React.useEffect(
    () => {
      const currentFilter = PapersQueryFormatter.objectifyPapersFilter(rawQueryParamsObj.filter);
      const savedFilter = !!savedFilterSet
        ? PapersQueryFormatter.objectifyPapersFilter(savedFilterSet.filter)
        : PapersQueryFormatter.objectifyPapersFilter(`year=:,fos=,journal=`);
      isEqual(savedFilter, currentFilter) ? setIsChange(false) : setIsChange(true);
    },
    [rawQueryParamsObj]
  );

  function getTitleBoxContent(currentFilterStr: string, props: FilterSaveBoxProps) {
    const changedFilter = !!savedFilterSet
      ? { ...savedFilterSet, filter: currentFilterStr }
      : {
          name: makeNewFilterSetTitle({
            fos: props.articleSearchState.fosFilterObject,
            journal: props.articleSearchState.journalFilterObject,
            yearFrom: props.articleSearchState.yearFilterFromValue,
            yearTo: props.articleSearchState.yearFilterToValue,
          }),
          emoji: "😃",
          filter: currentFilterStr,
        };

    const saveAndReset = isChange ? (
      <>
        <FilterSaveButton
          text="+ Save this Filter"
          handleClickSaveBtn={() => {
            handleClickSaveButton(changedFilter, props);
          }}
        />
        <FilterResetButton currentSavedFilterSet={!!savedFilterSet ? savedFilterSet.filter : ""} />
      </>
    ) : (
      <>
        {!!store.get("previousFilter") && savedFilterSet === null ? (
          <FilterSaveButton
            text="Apply previous Filter"
            buttonStyle={{ textDecoration: "underline" }}
            handleClickSaveBtn={() => {
              handleClickFilterItem(searchInput, sort, store.get("previousFilter"));
            }}
          />
        ) : null}
        <Icon
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={classNames({
            [styles.downArrow]: !isOpen,
            [styles.upArrow]: isOpen,
          })}
          icon="ARROW_POINT_TO_UP"
        />
      </>
    );

    if (savedFilterSet === null) {
      return (
        <div className={styles.filterTitleBox}>
          <Icon className={styles.filterResultButton} icon="FILTER_RESULT_BUTTON" />
          <span className={styles.filterContainerTitle}>PAPER FILTERS</span>
          {saveAndReset}
        </div>
      );
    } else {
      return (
        <div className={styles.filterTitleBox}>
          <span
            className={styles.filterContainerEmoji}
            onClick={() => {
              setIsOpenEmojiPicker(!isOpenEmojiPicker);
            }}
          >
            {savedFilterSet.emoji}
          </span>
          <span className={styles.filterContainerTitle}>
            {savedFilterSet.name}
            <span
              onClick={() => {
                setIsOpenTitleInput(!isOpenTitleInput);
              }}
              className={styles.titleControlIconWrapper}
            >
              <Icon icon="PEN" className={styles.titleControlIcon} />
            </span>
          </span>
          {saveAndReset}
        </div>
      );
    }
  }

  function handleClickFilterItem(
    query: string,
    sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS,
    filter: Filter | null
  ) {
    dispatch(setSavedFilterSet(!!filter ? filter : null));
    history.push({
      pathname: "/search",
      search: PapersQueryFormatter.stringifyPapersQuery({
        query,
        page: 1,
        sort,
        filter: !!filter ? PapersQueryFormatter.objectifyPapersFilter(filter.filter) : {},
      }),
    });
    setIsOpen(false);
  }

  const filterItem = props.articleSearchState.myFilters.map((filter, index) => {
    return (
      <SavedFilterItem
        searchInput={searchInput}
        sort={sort}
        savedFilter={filter}
        handleClickItem={handleClickFilterItem}
        handleDeleteItem={() => handleClickDeleteButton(props, index)}
        key={index}
      />
    );
  });

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsOpen(false);
      }}
    >
      <div ref={el => (popoverAnchorEl = el)}>
        {isOpenTitleInput && !!savedFilterSet ? (
          <>
            <span className={styles.filterTitleContainerEmoji}>{savedFilterSet.emoji}</span>
            <ScinapseInput
              placeholder="Write a Name for this filter"
              wrapperStyle={{ width: "100%" }}
              onChange={e => {
                setFilterTitle(e.currentTarget.value);
              }}
              value={savedFilterSet.name}
              inputStyle={{ width: "250px", height: "43px", fontSize: "14px", border: "none", margin: "0 0 0 32px" }}
            />
            <FilterSaveButton
              text="+ Save"
              buttonStyle={{ top: "13px", right: "58px" }}
              handleClickSaveBtn={() => {
                handleClickSaveButton({ ...savedFilterSet, name: filterTitle }, props);
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
          </>
        ) : (
          <div
            className={classNames({
              [styles.filterContainerTitleBox]: true,
              [styles.openFilterContainerTitleBox]: isOpen,
            })}
          >
            {getTitleBoxContent(rawQueryParamsObj.filter, props)}
          </div>
        )}
        {isOpenEmojiPicker ? (
          <Picker
            set="emojione"
            onSelect={(emoji: BaseEmoji) => {
              if (!!savedFilterSet) {
                const emojiChangedFilter = { ...savedFilterSet, emoji: emoji.native };
                handleClickSaveButton(emojiChangedFilter, props);
                setIsOpenEmojiPicker(!isOpenEmojiPicker);
              } else {
                alertToast({ type: "error", message: "Had an error to update emoji" });
              }
            }}
          />
        ) : null}

        <Popper
          open={isOpen}
          anchorEl={popoverAnchorEl!}
          placement="bottom-end"
          disablePortal={true}
          modifiers={{ flip: { enabled: false } }}
          style={{ width: "100%", position: "absolute", backgroundColor: "white", zIndex: 99 }}
        >
          <ul className={styles.popperWrapper}>
            <li onClick={() => handleClickFilterItem(searchInput, sort, null)} className={styles.filterItemWrapper}>
              <div className={styles.defaultFilterItem}>
                <Icon icon="DEFAULT" className={styles.defaultFilterItemIcon} />
                <span className={styles.defaultFilterItemTitle}>All Result (Default)</span>
              </div>
            </li>
            {filterItem}
          </ul>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default withRouter(connect()(withStyles<typeof FilterSaveBox>(styles)(FilterSaveBox)));
