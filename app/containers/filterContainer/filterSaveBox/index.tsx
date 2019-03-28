import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { isEqual } from "lodash";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ArticleSearchState } from "../../../components/articleSearch/records";
import { Filter, RawFilter } from "../../../api/member";
import { selectFilter, putCurrentUserFilters } from "../../../components/articleSearch/actions";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import SavedFilterItem from "../savedFilterItem";
import newFilterSetTitleGenerator from "../../../helpers/newFilterSetTitleGenerator";
import FilterTitleBox from "./titleBox";
import { CurrentUser } from "../../../model/currentUser";
import Icon from "../../../icons";
import { openSignIn } from "../../../components/dialog/actions";
import { stringifyFullFilterList, objectifyRawFilterList } from "../../../helpers/FilterObjectGenerator";
import { AppState } from "../../../reducers";
import { LOCAL_STORAGE_FILTERS } from "../../../components/articleSearch/constants";
const store = require("store");
const styles = require("./filterSaveBox.scss");

interface FilterSaveBoxProps {
  articleSearchState: ArticleSearchState;
  currentUserState: CurrentUser;
  dispatch: Dispatch<any>;
}

const FilterSaveBox: React.FunctionComponent<FilterSaveBoxProps & RouteComponentProps<any>> = props => {
  const { articleSearchState, currentUserState, dispatch, history, location } = props;
  const { selectedFilter, myFilters, searchInput, sort } = articleSearchState;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChange, setIsChange] = React.useState(false);
  const rawQueryParamsObj = getQueryParamsObject(location.search);
  const filterFromQueryParams = PapersQueryFormatter.objectifyPapersFilter(rawQueryParamsObj.filter);
  const popoverAnchorEl = React.useRef<HTMLDivElement | null>(null);

  let finalFilters: Filter[];
  if (currentUserState.isLoggedIn) {
    finalFilters = myFilters;
  } else {
    finalFilters = objectifyRawFilterList(store.get(LOCAL_STORAGE_FILTERS) || []);
  }

  React.useEffect(
    () => {
      const savedFilter = !!selectedFilter ? selectedFilter.filter : PapersQueryFormatter.objectifyPapersFilter();

      if (isEqual(savedFilter, filterFromQueryParams)) {
        setIsChange(false);
      } else {
        setIsChange(true);
      }
    },
    [props.location, selectedFilter]
  );

  React.useEffect(
    () => {
      if (!selectedFilter || !isEqual(filterFromQueryParams, selectedFilter.filter)) {
        const matchedFilter = finalFilters.find(filter => isEqual(filter.filter, filterFromQueryParams));
        if (matchedFilter) {
          dispatch(selectFilter(matchedFilter));
        }
      } else {
        if (!finalFilters.some(f => isEqual(f, selectedFilter))) {
          dispatch(selectFilter(null));
        }
      }
    },
    [props.location.search, finalFilters, selectedFilter]
  );

  const lastSavedFilters = React.useRef(myFilters);
  React.useEffect(
    () => {
      if (currentUserState.isLoggedIn) {
        if (!isEqual(lastSavedFilters.current, myFilters)) {
          const newFiltersReq = stringifyFullFilterList(myFilters);
          putCurrentUserFilters(newFiltersReq);
          lastSavedFilters.current = myFilters;
        }
      }
    },
    [currentUserState.isLoggedIn, myFilters]
  );

  function mergeNewFilterToFilterList(filterList: Filter[], newFilter: Filter) {
    if (selectedFilter) {
      const i = filterList.findIndex(f => isEqual(f, selectedFilter));

      if (i > -1) {
        return [newFilter, ...filterList.slice(0, i), ...filterList.slice(i + 1)];
      }
      return [newFilter, ...filterList];
    }
    return [newFilter, ...filterList];
  }

  function saveNewFilter(newFilter: Filter) {
    if (currentUserState.isLoggedIn) {
      const newFilters = mergeNewFilterToFilterList(myFilters, newFilter);
      dispatch(putCurrentUserFilters(stringifyFullFilterList(newFilters)));
    } else {
      const rawFilters: RawFilter[] = store.get(LOCAL_STORAGE_FILTERS) || [];
      const filters = objectifyRawFilterList(rawFilters);
      const newFilters = mergeNewFilterToFilterList(filters, newFilter);
      store.set(LOCAL_STORAGE_FILTERS, stringifyFullFilterList(newFilters));
      dispatch(selectFilter(newFilter));
    }
  }

  function handleClickSaveChangesBtn(newFilter: Filter | string, oldFilter: Filter) {
    const newFilterObj =
      typeof newFilter === "string"
        ? { ...oldFilter, filter: PapersQueryFormatter.objectifyPapersFilter(newFilter) }
        : newFilter;
    saveNewFilter(newFilterObj);
  }

  function handleClickCreateNewFilterBtn(filter: Filter | string) {
    if (myFilters.length >= 5 && !currentUserState.isLoggedIn) {
      return dispatch(openSignIn());
    }

    const baseEmojis = ["🐺", "🐶", "🦊", "🐱", "🦌", "🦒", "🐹", "🐰"];
    const randomEmoji = baseEmojis[Math.floor(Math.random() * baseEmojis.length)];
    const newFilter =
      typeof filter === "string"
        ? {
            name: newFilterSetTitleGenerator({
              fos: articleSearchState.fosFilterObject,
              journal: articleSearchState.journalFilterObject,
              yearFrom: articleSearchState.yearFilterFromValue,
              yearTo: articleSearchState.yearFilterToValue,
            }),
            emoji: randomEmoji,
            filter: PapersQueryFormatter.objectifyPapersFilter(filter),
          }
        : filter;
    saveNewFilter(newFilter);
  }

  function handleClickFilterItem(
    query: string,
    currentSort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS,
    filter: Filter | null
  ) {
    dispatch(selectFilter(!!filter ? filter : null));
    history.push({
      pathname: "/search",
      search: PapersQueryFormatter.stringifyPapersQuery({
        query,
        page: 1,
        sort: currentSort,
        filter: !!filter ? filter.filter : PapersQueryFormatter.objectifyPapersFilter(),
      }),
    });
    setIsOpen(false);
  }

  function handleClickDeleteButton(index: number) {
    if (currentUserState.isLoggedIn) {
      const newFilters = [...myFilters.slice(0, index), ...myFilters.slice(index + 1, myFilters.length)];
      const stringifiedNewFilters = stringifyFullFilterList(newFilters);
      dispatch(putCurrentUserFilters(stringifiedNewFilters));
    } else {
      const oldFilters = objectifyRawFilterList(store.get(LOCAL_STORAGE_FILTERS) || []);
      const newFilters = [...oldFilters.slice(0, index), ...oldFilters.slice(index + 1, oldFilters.length)];
      store.set(LOCAL_STORAGE_FILTERS, stringifyFullFilterList(newFilters));
      dispatch(selectFilter(null));
    }
  }

  const filterItems = finalFilters.map((filter, i) => {
    return (
      <SavedFilterItem
        searchInput={searchInput}
        sort={sort}
        savedFilter={filter}
        onClickFilterItem={handleClickFilterItem}
        onClickDeleteBtn={() => handleClickDeleteButton(i)}
        key={i}
      />
    );
  });

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsOpen(false);
      }}
    >
      <div ref={popoverAnchorEl}>
        <FilterTitleBox
          hasFilterChanged={isChange}
          isDropdownOpen={isOpen}
          onClickDropdownOpen={setIsOpen}
          onClickSaveChangesBtn={handleClickSaveChangesBtn}
          onClickCreateNewFilterBtn={handleClickCreateNewFilterBtn}
          onClickFilterItem={handleClickFilterItem}
          articleSearchState={articleSearchState}
        />
        <Popper
          open={isOpen}
          anchorEl={popoverAnchorEl.current}
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

function mapStateToProps(state: AppState) {
  return {
    articleSearchState: state.articleSearch,
    currentUserState: state.currentUser,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof FilterSaveBox>(styles)(FilterSaveBox)));
