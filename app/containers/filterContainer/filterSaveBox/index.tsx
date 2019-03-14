import * as React from "react";
import * as classNames from "classnames";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { isEqual } from "lodash";
import { withStyles } from "../../../helpers/withStylesHelper";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { ArticleSearchState } from "../../../components/articleSearch/records";
import { Filter } from "../../../api/member";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import FilterResetButton from "../../../components/filterContainer/filterResetButton";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import Icon from "../../../icons";
const styles = require("./filterSaveBox.scss");

interface FilterSaveBoxProps {
  articleSearchState: ArticleSearchState;
  dispatch: Dispatch<any>;
}

function getTitleBoxContent(currentFilter: Filter | null, isOpen: boolean, isChange: boolean) {
  const saveAndReset = isChange ? (
    <>
      <div className={styles.filterSaveButton}>+ Save this Filter</div>
      <FilterResetButton />
    </>
  ) : (
    <Icon
      className={classNames({
        [styles.downArrow]: !isOpen,
        [styles.upArrow]: isOpen,
      })}
      icon="ARROW_POINT_TO_UP"
    />
  );
  if (currentFilter === null) {
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
        <Icon className={styles.filterResultButton} icon="FILTER_RESULT_BUTTON" />
        <span className={styles.filterContainerTitle}>{currentFilter.name}</span>
        {saveAndReset}
      </div>
    );
  }
}

const FilterSaveBox: React.FunctionComponent<FilterSaveBoxProps & RouteComponentProps<any>> = props => {
  let popoverAnchorEl: HTMLDivElement | null;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChange, setIsChange] = React.useState(false);

  const rawQueryParamsObj: Scinapse.ArticleSearch.RawQueryParams = getQueryParamsObject(location.search);

  React.useEffect(
    () => {
      const currentFilter = PapersQueryFormatter.objectifyPapersFilter(rawQueryParamsObj.filter);
      const savedFilterSet = !!props.articleSearchState.currentFilterSet
        ? PapersQueryFormatter.objectifyPapersFilter(props.articleSearchState.currentFilterSet.filter)
        : PapersQueryFormatter.objectifyPapersFilter(`year=:,fos=,journal=`);
      isEqual(savedFilterSet, currentFilter) ? setIsChange(false) : setIsChange(true);
    },
    [rawQueryParamsObj]
  );

  const filterItem = props.articleSearchState.myFilters.map((filter, index) => {
    return (
      <li
        onClick={() => {
          props.dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_SET_FILTER_IN_MY_FILTER_SET, payload: filter });
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
        <div
          className={classNames({
            [styles.filterContainerTitleBox]: true,
            [styles.openFilterContainerTitleBox]: isOpen,
          })}
          onClick={() => {
            !isChange ? setIsOpen(!isOpen) : setIsOpen(isOpen);
          }}
        >
          {getTitleBoxContent(props.articleSearchState.currentFilterSet, isOpen, isChange)}
        </div>
        <Popper
          open={isOpen}
          anchorEl={popoverAnchorEl!}
          placement="bottom-end"
          disablePortal={true}
          modifiers={{
            flip: {
              enabled: false,
            },
          }}
          style={{
            width: "100%",
            position: "absolute",
            backgroundColor: "white",
            zIndex: 99,
          }}
        >
          <ul className={styles.popperWrapper}>
            <li
              onClick={() => {
                props.dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_SET_FILTER_IN_MY_FILTER_SET, payload: null });
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
