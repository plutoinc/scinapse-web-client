import * as React from "react";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import { withStyles } from "../../../../helpers/withStylesHelper";
import papersQueryFormatter, { SearchQueryObj } from "../../../../helpers/papersQueryFormatter";
import { FILTER_RANGE_TYPE, FILTER_BOX_TYPE, ChangeRangeInputParams, FILTER_TYPE_HAS_RANGE } from "../../actions";
import Icon from "../../../../icons";
const styles = require("./filterContainer.scss");

export interface FilterContainerProps {
  searchQueries: SearchQueryObj;
  handleChangeRangeInput: (params: ChangeRangeInputParams) => void;
  handleToggleFilterBox: (type: FILTER_BOX_TYPE) => void;
  yearFrom: number;
  yearTo: number;
  IFFrom: number;
  IFTo: number;
  isYearFilterOpen: boolean;
  isJournalIFFilterOpen: boolean;
  isFOSFilterOpen: boolean;
  isJournalFilterOpen: boolean;
}

function getSearchQueryParamsString(searchQueryObject: SearchQueryObj) {
  return `/search?${papersQueryFormatter.stringifyPapersQuery({
    query: searchQueryObject.query,
    page: 1,
    filter: {
      yearFrom: searchQueryObject.yearFrom,
      yearTo: searchQueryObject.yearTo,
      journalIFFrom: searchQueryObject.journalIFFrom,
      journalIFTo: searchQueryObject.journalIFTo,
    },
  })}`;
}

function getPublicationFilterBox(props: FilterContainerProps) {
  const { searchQueries, handleChangeRangeInput, yearFrom, yearTo, isYearFilterOpen, handleToggleFilterBox } = props;

  const currentYear = new Date().getFullYear();

  const fromToCurrentYearDiff = searchQueries && !!searchQueries.yearFrom ? currentYear - searchQueries.yearFrom : 0;

  return (
    <div
      className={classNames({
        [`${styles.filterBox}`]: true,
        [`${styles.yearFilterIsOpen}`]: isYearFilterOpen,
      })}
    >
      <div className={styles.filterTitleBox}>
        <div className={styles.filterTitle}>Publication Year</div>
        <span
          className={classNames({
            [`${styles.toggleBoxIconWrapper}`]: true,
            [`${styles.isClosed}`]: isYearFilterOpen,
          })}
          onClick={() => {
            handleToggleFilterBox(FILTER_BOX_TYPE.PUBLISHED_YEAR);
          }}
        >
          <Icon icon="ARROW_POINT_TO_DOWN" />
        </span>
      </div>
      <Link
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: !yearFrom && !yearTo,
        })}
        to={getSearchQueryParamsString({ ...searchQueries, ...{ yearFrom: null, yearTo: null } })}
      >
        All
      </Link>
      <Link
        to={getSearchQueryParamsString({ ...searchQueries, ...{ yearFrom: currentYear - 3, yearTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 3 && !yearTo,
        })}
      >
        Last 3 years
      </Link>
      <Link
        to={getSearchQueryParamsString({ ...searchQueries, ...{ yearFrom: currentYear - 5, yearTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 5 && !yearTo,
        })}
      >
        Last 5 years
      </Link>
      <Link
        to={getSearchQueryParamsString({ ...searchQueries, ...{ yearFrom: currentYear - 10, yearTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 10 && !yearTo,
        })}
      >
        Last 10 years
      </Link>
      <div
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.rangeFilterItem}`]: true,
          [`${styles.isSelected}`]: !!yearFrom && !!yearTo,
        })}
      >
        Set Range
      </div>
      <div className={styles.yearFilterRangeBox}>
        <input
          className={styles.yearInput}
          onChange={e => {
            handleChangeRangeInput({
              rangeType: FILTER_RANGE_TYPE.FROM,
              type: FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
              numberValue: parseInt(e.currentTarget.value, 10),
            });
          }}
          min={0}
          placeholder="YYYY"
          value={yearFrom}
          type="number"
        />
        <span className={styles.yearDash}> - </span>
        <input
          className={styles.yearInput}
          onChange={e => {
            handleChangeRangeInput({
              rangeType: FILTER_RANGE_TYPE.TO,
              type: FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
              numberValue: parseInt(e.currentTarget.value, 10),
            });
          }}
          min={0}
          type="number"
          placeholder="YYYY"
          value={yearTo}
        />
        <Link
          className={styles.yearSubmitLink}
          to={getSearchQueryParamsString({ ...searchQueries, ...{ yearFrom, yearTo } })}
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

function getJournalIFFilterBox(props: FilterContainerProps) {
  const { searchQueries, handleToggleFilterBox, isJournalIFFilterOpen, handleChangeRangeInput, IFFrom, IFTo } = props;

  return (
    <div
      className={classNames({
        [`${styles.filterBox}`]: true,
        [`${styles.journalIFFilterOpen}`]: isJournalIFFilterOpen,
      })}
    >
      <div className={styles.filterTitleBox}>
        <div className={styles.filterTitle}>Journal IF</div>
        <span
          className={classNames({
            [`${styles.toggleBoxIconWrapper}`]: true,
            [`${styles.isClosed}`]: isJournalIFFilterOpen,
          })}
          onClick={() => {
            handleToggleFilterBox(FILTER_BOX_TYPE.JOURNAL_IF);
          }}
        >
          <Icon icon="ARROW_POINT_TO_DOWN" />
        </span>
      </div>
      <Link
        to={getSearchQueryParamsString({ ...searchQueries, ...{ journalIFFrom: null, journalIFTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: !searchQueries.journalIFFrom && !searchQueries.journalIFTo,
        })}
      >
        All
      </Link>
      <Link
        to={getSearchQueryParamsString({ ...searchQueries, ...{ journalIFFrom: 10, journalIFTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: searchQueries.journalIFFrom === 10 && !searchQueries.journalIFTo,
        })}
      >
        More than 10
      </Link>
      <Link
        to={getSearchQueryParamsString({ ...searchQueries, ...{ journalIFFrom: 5, journalIFTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: searchQueries.journalIFFrom === 5 && !searchQueries.journalIFTo,
        })}
      >
        More than 5
      </Link>
      <Link
        to={getSearchQueryParamsString({ ...searchQueries, ...{ journalIFFrom: 1, journalIFTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: searchQueries.journalIFFrom === 1 && !searchQueries.journalIFTo,
        })}
      >
        More than 1
      </Link>
      <div
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.rangeFilterItem}`]: true,
          [`${styles.isSelected}`]: !!searchQueries.journalIFFrom && !!searchQueries.journalIFTo,
        })}
      >
        Set Range
      </div>
      <div className={styles.yearFilterRangeBox}>
        <input
          className={styles.yearInput}
          onChange={e => {
            handleChangeRangeInput({
              rangeType: FILTER_RANGE_TYPE.FROM,
              type: FILTER_TYPE_HAS_RANGE.JOURNAL_IF,
              numberValue: parseInt(e.currentTarget.value, 10),
            });
          }}
          min={0}
          placeholder=""
          value={IFFrom}
          type="number"
        />
        <span className={styles.yearDash}> - </span>
        <input
          className={styles.yearInput}
          min={0}
          onChange={e => {
            handleChangeRangeInput({
              rangeType: FILTER_RANGE_TYPE.TO,
              type: FILTER_TYPE_HAS_RANGE.JOURNAL_IF,
              numberValue: parseInt(e.currentTarget.value, 10),
            });
          }}
          type="number"
          placeholder=""
          value={IFTo}
        />
        <Link
          className={styles.yearSubmitLink}
          to={getSearchQueryParamsString({ ...searchQueries, ...{ journalIFFrom: IFFrom, journalIFTo: IFTo } })}
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

function getFOSFilterBox(props: FilterContainerProps) {
  const { isFOSFilterOpen, handleToggleFilterBox } = props;

  return (
    <div
      className={classNames({
        [`${styles.filterBox}`]: true,
        [`${styles.journalIFFilterOpen}`]: isFOSFilterOpen,
      })}
    >
      <div className={styles.filterTitleBox}>
        <div className={styles.filterTitle}>Field of study</div>
        <span
          className={classNames({
            [`${styles.toggleBoxIconWrapper}`]: true,
            [`${styles.isClosed}`]: isFOSFilterOpen,
          })}
          onClick={() => {
            handleToggleFilterBox(FILTER_BOX_TYPE.FOS);
          }}
        >
          <Icon icon="ARROW_POINT_TO_DOWN" />
        </span>
      </div>
    </div>
  );
}

const FilterContainer = (props: FilterContainerProps) => {
  return (
    <div className={styles.filterContainer}>
      {getPublicationFilterBox(props)}
      {getJournalIFFilterBox(props)}
      {getFOSFilterBox(props)}
    </div>
  );
};

export default withStyles<typeof FilterContainer>(styles)(FilterContainer);
