import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { isEqual, findIndex } from "lodash";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ArticleSearchState } from "../../../components/articleSearch/records";
import { Filter } from "../../../api/member";
import { setSavedFilterSet, putMyFilters } from "../../../components/articleSearch/actions";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import SavedFilterItem from "../savedFilterItem";
import makeNewFilterSetTitle from "../../../helpers/makeNewFilterSetTitle";
import FilterTitleBox from "./titleBox";
import Icon from "../../../icons";
const styles = require("./filterSaveBox.scss");

interface FilterSaveBoxProps {
  articleSearchState: ArticleSearchState;
  dispatch: Dispatch<any>;
}

const FilterSaveBox: React.FunctionComponent<FilterSaveBoxProps & RouteComponentProps<any>> = props => {
  const { articleSearchState, dispatch, history, location } = props;
  const { savedFilterSet, myFilters, searchInput, sort } = articleSearchState;

  let popoverAnchorEl: HTMLDivElement | null;

  const [isOpen, setIsOpen] = React.useState(false);
  const [isChange, setIsChange] = React.useState(false);

  const rawQueryParamsObj = getQueryParamsObject(location.search);

  React.useEffect(
    () => {
      const currentFilter = PapersQueryFormatter.objectifyPapersFilter(rawQueryParamsObj.filter);
      const savedFilter = !!savedFilterSet
        ? PapersQueryFormatter.objectifyPapersFilter(savedFilterSet.filter)
        : PapersQueryFormatter.objectifyPapersFilter();

      if (isEqual(savedFilter, currentFilter)) {
        setIsChange(false);
      } else {
        setIsChange(true);
      }
    },
    [props.location, savedFilterSet]
  );

  function handleClickSaveButton(changedFilterReq: Filter | string) {
    let changedFilter: Filter | null = null;

    if (typeof changedFilterReq === "string") {
      changedFilter = !!savedFilterSet
        ? { ...savedFilterSet, filter: changedFilterReq }
        : {
            name: makeNewFilterSetTitle({
              fos: articleSearchState.fosFilterObject,
              journal: articleSearchState.journalFilterObject,
              yearFrom: articleSearchState.yearFilterFromValue,
              yearTo: articleSearchState.yearFilterToValue,
            }),
            emoji: "😃",
            filter: changedFilterReq,
          };
    } else {
      changedFilter = changedFilterReq;
    }

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

  function handleClickDeleteButton(deleteIndex: number) {
    const newFilters = [...myFilters.slice(0, deleteIndex), ...myFilters.slice(deleteIndex + 1, myFilters.length)];

    dispatch(putMyFilters(newFilters));
    if (!savedFilterSet || (!!savedFilterSet && !myFilters.includes(savedFilterSet))) {
      dispatch(setSavedFilterSet(null));
    }
  }

  const filterItems = props.articleSearchState.myFilters.map((filter, index) => {
    return (
      <SavedFilterItem
        searchInput={searchInput}
        sort={sort}
        savedFilter={filter}
        onClickFilterItem={handleClickFilterItem}
        onClickDeleteBtn={() => handleClickDeleteButton(index)}
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
        <FilterTitleBox
          hasFilterChanged={isChange}
          isDropdownOpen={isOpen}
          onClickDropdownOpen={setIsOpen}
          onClickSaveBtn={handleClickSaveButton}
          onClickFilterItem={handleClickFilterItem}
          articleSearchState={articleSearchState}
        />
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
            {filterItems}
          </ul>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default withRouter(connect()(withStyles<typeof FilterSaveBox>(styles)(FilterSaveBox)));
