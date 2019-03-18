import * as React from "react";
import * as classNames from "classnames";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { isEqual, findIndex } from "lodash";
import { BaseEmoji } from "emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index";
import { withStyles } from "../../../helpers/withStylesHelper";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { ArticleSearchState } from "../../../components/articleSearch/records";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import FilterResetButton from "../../../components/filterContainer/filterResetButton";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import Icon from "../../../icons";
import FilterSaveButton from "../../../components/filterContainer/filterSaveButton";
import { setSavedFilterSet, putMyFilters } from "../../../components/articleSearch/actions";
import { Picker } from "emoji-mart";
import { Filter } from "../../../api/member";
import alertToast from "../../../helpers/makePlutoToastAction";
import ScinapseInput from "../../../components/common/scinapseInput";
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

const FilterSaveBox: React.FunctionComponent<FilterSaveBoxProps & RouteComponentProps<any>> = props => {
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
      const savedFilterSet = !!props.articleSearchState.savedFilterSet
        ? PapersQueryFormatter.objectifyPapersFilter(props.articleSearchState.savedFilterSet.filter)
        : PapersQueryFormatter.objectifyPapersFilter(`year=:,fos=,journal=`);
      isEqual(savedFilterSet, currentFilter) ? setIsChange(false) : setIsChange(true);
    },
    [rawQueryParamsObj]
  );

  function getTitleBoxContent(currentFilterStr: string, props: FilterSaveBoxProps) {
    const changedFilter = !!props.articleSearchState.savedFilterSet
      ? { ...props.articleSearchState.savedFilterSet, filter: currentFilterStr }
      : { name: `${Math.floor(Math.random() * 100)}`, emoji: "😃", filter: currentFilterStr };

    const saveAndReset = isChange ? (
      <>
        <FilterSaveButton
          text="+ Save this Filter"
          handleClickSaveBtn={() => {
            handleClickSaveButton(changedFilter, props);
          }}
        />
        <FilterResetButton />
      </>
    ) : (
      <Icon
        onClick={() => {
          !isChange ? setIsOpen(!isOpen) : setIsOpen(isOpen);
        }}
        className={classNames({
          [styles.downArrow]: !isOpen,
          [styles.upArrow]: isOpen,
        })}
        icon="ARROW_POINT_TO_UP"
      />
    );

    if (props.articleSearchState.savedFilterSet === null) {
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
            {props.articleSearchState.savedFilterSet.emoji}
          </span>
          <span className={styles.filterContainerTitle}>
            {props.articleSearchState.savedFilterSet.name}
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

  const filterItem = props.articleSearchState.myFilters.map((filter, index) => {
    return (
      <li
        onClick={() => {
          props.dispatch(setSavedFilterSet(filter));
          props.history.push({
            pathname: "/search",
            search: PapersQueryFormatter.stringifyPapersQuery({
              query: props.articleSearchState.searchInput,
              page: 1,
              sort: props.articleSearchState.sort,
              filter: PapersQueryFormatter.objectifyPapersFilter(filter.filter),
            }),
          });
          setIsOpen(false);
        }}
        className={styles.filterItemWrapper}
        key={index}
      >
        <div className={styles.filterItem}>
          <Icon icon="FILTER_RESULT_BUTTON" className={styles.filterItemIcon} />
          <span className={styles.filterItemTitle}>{filter.name}</span>
        </div>
      </li>
    );
  });

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsOpen(false);
      }}
    >
      <div ref={el => (popoverAnchorEl = el)}>
        {isOpenTitleInput && !!props.articleSearchState.savedFilterSet ? (
          <>
            <span className={styles.filterTitleContainerEmoji}>{props.articleSearchState.savedFilterSet.emoji}</span>
            <ScinapseInput
              placeholder="Write a Name for this filter"
              wrapperStyle={{ width: "100%" }}
              onChange={e => {
                setFilterTitle(e.currentTarget.value);
              }}
              value={props.articleSearchState.savedFilterSet.name}
              inputStyle={{ width: "250px", height: "43px", fontSize: "14px", border: "none", margin: "0 0 0 32px" }}
            />
            <FilterSaveButton
              text="+ Save"
              buttonStyle={{ top: "13px", right: "58px" }}
              handleClickSaveBtn={() => {
                handleClickSaveButton({ ...props.articleSearchState.savedFilterSet, name: filterTitle }, props);
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
              if (!!props.articleSearchState.savedFilterSet) {
                const emojiChangedFilter = { ...props.articleSearchState.savedFilterSet, emoji: emoji.native };
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
            <li
              onClick={() => {
                props.dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_SET_FILTER_IN_MY_FILTER_SET, payload: null });
                props.history.push({
                  pathname: "/search",
                  search: PapersQueryFormatter.stringifyPapersQuery({
                    query: props.articleSearchState.searchInput,
                    page: 1,
                    sort: props.articleSearchState.sort,
                    filter: {},
                  }),
                });
                setIsOpen(false);
              }}
              className={styles.filterItemWrapper}
            >
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
