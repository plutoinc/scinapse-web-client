import * as React from "react";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import { withStyles } from "../../../../helpers/withStylesHelper";
import papersQueryFormatter, {
  ParsedSearchPageQueryParams,
  GetStringifiedPaperFilterParams,
} from "../../../../helpers/papersQueryFormatter";
import { FILTER_RANGE_TYPE, FILTER_BOX_TYPE, ChangeRangeInputParams, FILTER_TYPE_HAS_RANGE } from "../../actions";
import Icon from "../../../../icons";
import { AggregationDataRecord } from "../../../../model/aggregation";
import { Checkbox } from "material-ui";
const styles = require("./filterContainer.scss");

export interface FilterContainerProps {
  searchQueries: ParsedSearchPageQueryParams;
  handleChangeRangeInput: (params: ChangeRangeInputParams) => void;
  handleToggleFilterBox: (type: FILTER_BOX_TYPE) => void;
  aggregationData: AggregationDataRecord;
  yearFrom: number;
  yearTo: number;
  IFFrom: number;
  IFTo: number;
  isYearFilterOpen: boolean;
  isJournalIFFilterOpen: boolean;
  isFOSFilterOpen: boolean;
  isJournalFilterOpen: boolean;
}

const COMMON_CHECKBOX_STYLE = {
  display: "inline-block",
  verticalAlign: "top",
  marginTop: "2px",
  marginRight: "7px",
  width: "13px",
  height: "13px",
};

const COMMON_ICON_STYLE = { width: "13px", height: "13px", fill: "#6096ff" };

function getSearchQueryParamsString(
  searchQueryObject: ParsedSearchPageQueryParams,
  addedFilter: GetStringifiedPaperFilterParams,
) {
  return `/search?${papersQueryFormatter.stringifyPapersQuery({
    query: searchQueryObject.query,
    page: 1,
    filter: { ...searchQueryObject.filter, ...addedFilter },
  })}`;
}

function getPublicationFilterBox(props: FilterContainerProps) {
  const { searchQueries, handleChangeRangeInput, yearFrom, yearTo, isYearFilterOpen, handleToggleFilterBox } = props;

  const currentYear = new Date().getFullYear();

  const fromToCurrentYearDiff =
    searchQueries && searchQueries.filter && !!searchQueries.filter.yearFrom
      ? currentYear - searchQueries.filter.yearFrom
      : 0;

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
        to={getSearchQueryParamsString(searchQueries, { yearFrom: null, yearTo: null })}
      >
        All
      </Link>
      <Link
        to={getSearchQueryParamsString(searchQueries, {
          yearFrom: currentYear - 3,
          yearTo: null,
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 3 && !yearTo,
        })}
      >
        Last 3 years
      </Link>
      <Link
        to={getSearchQueryParamsString(searchQueries, {
          yearFrom: currentYear - 5,
          yearTo: null,
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 5 && !yearTo,
        })}
      >
        Last 5 years
      </Link>
      <Link
        to={getSearchQueryParamsString(searchQueries, {
          yearFrom: currentYear - 10,
          yearTo: null,
        })}
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
        <Link className={styles.yearSubmitLink} to={getSearchQueryParamsString(searchQueries, { yearFrom, yearTo })}>
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
        to={getSearchQueryParamsString(searchQueries, { journalIFFrom: null, journalIFTo: null })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]:
            searchQueries.filter && !searchQueries.filter.journalIFFrom && !searchQueries.filter.journalIFTo,
        })}
      >
        All
      </Link>
      <Link
        to={getSearchQueryParamsString(searchQueries, { journalIFFrom: 10, journalIFTo: null })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]:
            searchQueries.filter && searchQueries.filter.journalIFFrom === 10 && !searchQueries.filter.journalIFTo,
        })}
      >
        More than 10
      </Link>
      <Link
        to={getSearchQueryParamsString(searchQueries, { journalIFFrom: 5, journalIFTo: null })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]:
            searchQueries.filter && searchQueries.filter.journalIFFrom === 5 && !searchQueries.filter.journalIFTo,
        })}
      >
        More than 5
      </Link>
      <Link
        to={getSearchQueryParamsString(searchQueries, { journalIFFrom: 1, journalIFTo: null })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]:
            searchQueries.filter && searchQueries.filter.journalIFFrom === 1 && !searchQueries.filter.journalIFTo,
        })}
      >
        More than 1
      </Link>
      <div
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.rangeFilterItem}`]: true,
          [`${styles.isSelected}`]:
            searchQueries.filter && !!searchQueries.filter.journalIFFrom && !!searchQueries.filter.journalIFTo,
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
          to={getSearchQueryParamsString(searchQueries, {
            journalIFFrom: IFFrom,
            journalIFTo: IFTo,
          })}
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

function getFOSFilterBox(props: FilterContainerProps) {
  const { aggregationData, isFOSFilterOpen, handleToggleFilterBox, searchQueries } = props;

  const pastFosIdList = searchQueries.filter && searchQueries.filter.fos ? searchQueries.filter.fos : [];

  const fosItems =
    aggregationData &&
    aggregationData.fosList.map(fos => {
      const alreadyHasFOSInFilter = pastFosIdList.some(pastFos => pastFos === fos.id);

      const newFilter = alreadyHasFOSInFilter
        ? pastFosIdList.map(id => {
            if (id === fos.id) {
              return null;
            } else {
              return id;
            }
          })
        : pastFosIdList.concat([fos.id]);

      return (
        <Link
          key={`fos_${fos.id}`}
          to={getSearchQueryParamsString(searchQueries, { fos: newFilter })}
          className={classNames({
            [`${styles.filterItem}`]: true,
            [`${styles.isSelected}`]: alreadyHasFOSInFilter,
          })}
        >
          <Checkbox style={COMMON_CHECKBOX_STYLE} iconStyle={COMMON_ICON_STYLE} checked={alreadyHasFOSInFilter} />
          <span>{fos.name}</span>
        </Link>
      );
    });

  return (
    <div
      className={classNames({
        [`${styles.filterBox}`]: true,
        [`${styles.FOSFilterOpen}`]: isFOSFilterOpen,
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
      {fosItems}
    </div>
  );
}

function getJournalFilter(props: FilterContainerProps) {
  const { aggregationData, isJournalFilterOpen, handleToggleFilterBox, searchQueries } = props;

  const journalIdList = searchQueries.filter && searchQueries.filter.journal ? searchQueries.filter.journal : [];

  const journalItems =
    aggregationData &&
    aggregationData.journals.map(journal => {
      const alreadyHasJournalInFilter = journalIdList.some(journalId => journalId === journal.id);

      const newFilter = alreadyHasJournalInFilter
        ? journalIdList.map(id => {
            if (id === journal.id) {
              return null;
            } else {
              return id;
            }
          })
        : journalIdList.concat([journal.id]);

      return (
        <Link
          key={`journal_${journal.id}`}
          to={getSearchQueryParamsString(searchQueries, { journal: newFilter })}
          className={classNames({
            [`${styles.filterItem}`]: true,
            [`${styles.isSelected}`]: alreadyHasJournalInFilter,
          })}
        >
          <Checkbox style={COMMON_CHECKBOX_STYLE} iconStyle={COMMON_ICON_STYLE} checked={alreadyHasJournalInFilter} />
          <span>{journal.title}</span>
        </Link>
      );
    });

  return (
    <div
      className={classNames({
        [`${styles.filterBox}`]: true,
        [`${styles.FOSFilterOpen}`]: isJournalFilterOpen,
      })}
    >
      <div className={styles.filterTitleBox}>
        <div className={styles.filterTitle}>Journal</div>
        <span
          className={classNames({
            [`${styles.toggleBoxIconWrapper}`]: true,
            [`${styles.isClosed}`]: isJournalFilterOpen,
          })}
          onClick={() => {
            handleToggleFilterBox(FILTER_BOX_TYPE.JOURNAL);
          }}
        >
          <Icon icon="ARROW_POINT_TO_DOWN" />
        </span>
      </div>
      {journalItems}
    </div>
  );
}

const FilterContainer = (props: FilterContainerProps) => {
  return (
    <div className={styles.filterContainer}>
      {getPublicationFilterBox(props)}
      {getJournalIFFilterBox(props)}
      {getFOSFilterBox(props)}
      {getJournalFilter(props)}
    </div>
  );
};

export default withStyles<typeof FilterContainer>(styles)(FilterContainer);
