import * as React from "react";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import { withStyles } from "../../../../helpers/withStylesHelper";
import papersQueryFormatter, { SearchQueryObj } from "../../../../helpers/papersQueryFormatter";
import { PUBLISH_YEAR_FILTER_TYPE } from "../../actions";
const styles = require("./filterContainer.scss");

export interface FilterContainerProps {
  searchQueries: SearchQueryObj;
  handleYearFilterInputChange: (type: PUBLISH_YEAR_FILTER_TYPE, year: number) => void;
  yearFrom: number;
  yearTo: number;
}

function getSearchQueryParmasString(searchQueryObject: SearchQueryObj) {
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
  const { searchQueries, handleYearFilterInputChange, yearFrom, yearTo } = props;

  const currentYear = new Date().getFullYear();

  const fromToCurrentYearDiff = searchQueries && !!searchQueries.yearFrom ? currentYear - searchQueries.yearFrom : 0;

  return (
    <div className={styles.publicationYearFilterWrapper}>
      <div className={styles.filterTitle}>Publication Year</div>
      <div className={styles.filterItem}>ALL</div>
      <Link
        to={getSearchQueryParmasString({ ...searchQueries, ...{ yearFrom: currentYear - 3, yearTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 3,
        })}
      >
        Last 3 years
      </Link>
      <Link
        to={getSearchQueryParmasString({ ...searchQueries, ...{ yearFrom: currentYear - 5, yearTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 5,
        })}
      >
        Last 5 years
      </Link>
      <Link
        to={getSearchQueryParmasString({ ...searchQueries, ...{ yearFrom: currentYear - 10, yearTo: null } })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 10,
        })}
      >
        Last 10 years
      </Link>
      <div
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: !yearFrom && !yearTo,
        })}
      >
        Set Range
      </div>
      <div className={styles.yearFilterRangeBox}>
        <input
          className={styles.yearInput}
          onChange={e => {
            handleYearFilterInputChange(PUBLISH_YEAR_FILTER_TYPE.FROM, parseInt(e.currentTarget.value, 10));
          }}
          placeholder="YYYY"
          value={yearFrom}
          type="number"
        />
        <span> - </span>
        <input
          className={styles.yearInput}
          onChange={e => {
            handleYearFilterInputChange(PUBLISH_YEAR_FILTER_TYPE.TO, parseInt(e.currentTarget.value, 10));
          }}
          type="number"
          placeholder="YYYY"
          value={yearTo}
        />
        <Link
          className={styles.yearSubmitLink}
          to={getSearchQueryParmasString({ ...searchQueries, ...{ yearFrom, yearTo } })}
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

const FilterContainer = (props: FilterContainerProps) => {
  return <div className={styles.filterContainer}>{getPublicationFilterBox(props)}</div>;
};

export default withStyles<typeof FilterContainer>(styles)(FilterContainer);
