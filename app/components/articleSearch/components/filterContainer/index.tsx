import * as React from "react";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { FilterObject } from "../../../../helpers/papersQueryFormatter";
import {
  FILTER_RANGE_TYPE,
  FILTER_BOX_TYPE,
  ChangeRangeInputParams,
  FILTER_TYPE_HAS_RANGE,
  FILTER_TYPE_HAS_EXPANDING_OPTION,
} from "../../actions";
import Icon from "../../../../icons";
import { toggleElementFromArray } from "../../../../helpers/toggleElementFromArray";
import { trackEvent } from "../../../../helpers/handleGA";
import formatNumber from "../../../../helpers/formatNumber";
import { ArticleSearchState } from "../../records";
const styles = require("./filterContainer.scss");

export interface FilterContainerProps {
  handleChangeRangeInput: (params: ChangeRangeInputParams) => void;
  handleToggleFilterBox: (type: FILTER_BOX_TYPE) => void;
  handleToggleExpandingFilter: (type: FILTER_TYPE_HAS_EXPANDING_OPTION) => void;
  makeNewFilterLink: (newFilter: FilterObject) => string;
  articleSearchState: ArticleSearchState;
}

interface RangeSet {
  from: number;
  to: number;
  doc_count: number;
}

interface YearSet {
  year: number;
  doc_count: number;
}

interface CalculateIFCountParams {
  rangeSetList: RangeSet[];
  minIF: number;
  maxIF: number | null;
}

interface CalculateYearsCountParams {
  rangeSetList: YearSet[];
  minYear: number;
}

function calculateIFCount({ rangeSetList, minIF, maxIF }: CalculateIFCountParams) {
  const targetList = rangeSetList.filter(rangeSet => {
    if (maxIF) {
      return rangeSet.from >= minIF && rangeSet.to < maxIF;
    } else {
      return rangeSet.from >= minIF;
    }
  });

  return targetList.reduce((a, b) => {
    return a! + b!.doc_count;
  }, 0);
}

function calculateYearsCount({ rangeSetList, minYear }: CalculateYearsCountParams) {
  const targetList = rangeSetList.filter(rangeSet => {
    return rangeSet.year >= minYear;
  });

  return targetList.reduce((a, b) => {
    return a! + b!.doc_count;
  }, 0);
}

function getPublicationFilterBox(props: FilterContainerProps) {
  const { articleSearchState, handleChangeRangeInput, handleToggleFilterBox } = props;

  const currentYear = new Date().getFullYear();
  const fromToCurrentYearDiff = currentYear - articleSearchState.yearFilterFromValue;

  const overallFieldData = articleSearchState.aggregationData
    ? articleSearchState.aggregationData.years.find(year => year.year === null)
    : null;
  const paperCountOfAllFilter = overallFieldData ? overallFieldData.doc_count : 0;

  const yearRangeList = articleSearchState.aggregationData ? articleSearchState.aggregationData.years : [];

  return (
    <div
      className={classNames({
        [`${styles.filterBox}`]: true,
        [`${styles.yearFilterIsOpen}`]: articleSearchState.isYearFilterOpen,
      })}
    >
      <div
        className={styles.filterTitleBox}
        onClick={() => {
          handleToggleFilterBox(FILTER_BOX_TYPE.PUBLISHED_YEAR);
        }}
      >
        <div className={styles.filterTitle}>Publication Year</div>
        <span
          className={classNames({
            [`${styles.toggleBoxIconWrapper}`]: true,
            [`${styles.isClosed}`]: articleSearchState.isYearFilterOpen,
          })}
        >
          <Icon icon="ARROW_POINT_TO_UP" />
        </span>
      </div>
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "Publication Year" });
        }}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: !articleSearchState.yearFilterFromValue && !articleSearchState.yearFilterToValue,
        })}
        to={props.makeNewFilterLink({
          yearFrom: undefined,
          yearTo: undefined,
        })}
      >
        <span className={styles.linkTitle}>All</span>
        <span className={styles.countBox}>{`(${formatNumber(paperCountOfAllFilter)})`}</span>
      </Link>
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "Publication Year" });
        }}
        to={props.makeNewFilterLink({
          yearFrom: currentYear - 3,
          yearTo: undefined,
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 3 && !articleSearchState.yearFilterToValue,
        })}
      >
        <span className={styles.linkTitle}>Last 3 years</span>
        <span className={styles.countBox}>{`(${formatNumber(
          calculateYearsCount({
            rangeSetList: yearRangeList,
            minYear: currentYear - 3,
          })
        )})`}</span>
      </Link>
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "Publication Year" });
        }}
        to={props.makeNewFilterLink({
          yearFrom: currentYear - 5,
          yearTo: undefined,
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 5 && !articleSearchState.yearFilterToValue,
        })}
      >
        <span className={styles.linkTitle}>Last 5 years</span>
        <span className={styles.countBox}>{`(${formatNumber(
          calculateYearsCount({
            rangeSetList: yearRangeList,
            minYear: currentYear - 5,
          })
        )})`}</span>
      </Link>
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "Publication Year" });
        }}
        to={props.makeNewFilterLink({
          yearFrom: currentYear - 10,
          yearTo: undefined,
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: fromToCurrentYearDiff === 10 && !articleSearchState.yearFilterToValue,
        })}
      >
        <span className={styles.linkTitle}>Last 10 years</span>
        <span className={styles.countBox}>{`(${formatNumber(
          calculateYearsCount({
            rangeSetList: yearRangeList,
            minYear: currentYear - 10,
          })
        )})`}</span>
      </Link>
      <div
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.rangeFilterItem}`]: true,
          [`${styles.isSelected}`]: !!articleSearchState.yearFilterFromValue && !!articleSearchState.yearFilterToValue,
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
          placeholder="YYYY"
          value={articleSearchState.yearFilterFromValue || 0}
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
          type="number"
          placeholder="YYYY"
          value={articleSearchState.yearFilterToValue || 0}
        />
        <Link
          onClick={() => {
            trackEvent({
              category: "Search",
              action: "Filter",
              label: "",
            });
          }}
          className={styles.yearSubmitLink}
          to={props.makeNewFilterLink({
            yearFrom: articleSearchState.yearFilterFromValue,
            yearTo: articleSearchState.yearFilterToValue,
          })}
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

function getJournalIFFilterBox(props: FilterContainerProps) {
  const { articleSearchState, handleToggleFilterBox, handleChangeRangeInput } = props;

  const overallFieldData = articleSearchState.aggregationData
    ? articleSearchState.aggregationData.impactFactors.find(IF => IF.from === null && IF.to === null)
    : null;
  const paperCountOfAllFilter = overallFieldData ? overallFieldData.doc_count : 0;
  const IFRange = articleSearchState.aggregationData
    ? (articleSearchState.aggregationData.impactFactors as RangeSet[])
    : [];

  return (
    <div
      className={classNames({
        [`${styles.filterBox}`]: true,
        [`${styles.journalIFFilterOpen}`]: articleSearchState.isJournalIFFilterOpen,
      })}
    >
      <div
        className={styles.filterTitleBox}
        onClick={() => {
          handleToggleFilterBox(FILTER_BOX_TYPE.JOURNAL_IF);
        }}
      >
        <div className={styles.filterTitle}>Journal IF</div>
        <span
          className={classNames({
            [`${styles.toggleBoxIconWrapper}`]: true,
            [`${styles.isClosed}`]: articleSearchState.isJournalIFFilterOpen,
          })}
        >
          <Icon icon="ARROW_POINT_TO_UP" />
        </span>
      </div>
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "Journal IF" });
        }}
        to={props.makeNewFilterLink({
          journalIFFrom: undefined,
          journalIFTo: undefined,
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: !articleSearchState.IFFilterFromValue && !articleSearchState.IFFilterToValue,
        })}
      >
        <span className={styles.linkTitle}>All</span>
        <span className={styles.countBox}>{`(${formatNumber(paperCountOfAllFilter)})`}</span>
      </Link>
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "Journal IF" });
        }}
        to={props.makeNewFilterLink({
          journalIFFrom: 10,
          journalIFTo: undefined,
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: articleSearchState.IFFilterFromValue === 10 && !articleSearchState.IFFilterToValue,
        })}
      >
        <span className={styles.linkTitle}>More than 10</span>
        <span className={styles.countBox}>{`(${formatNumber(
          calculateIFCount({
            rangeSetList: IFRange,
            minIF: 10,
            maxIF: null,
          })
        )})`}</span>
      </Link>
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "Journal IF" });
        }}
        to={props.makeNewFilterLink({
          journalIFFrom: 5,
          journalIFTo: undefined,
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: articleSearchState.IFFilterFromValue === 5 && !articleSearchState.IFFilterToValue,
        })}
      >
        <span className={styles.linkTitle}>More than 5</span>
        <span className={styles.countBox}>{`(${formatNumber(
          calculateIFCount({
            rangeSetList: IFRange,
            minIF: 5,
            maxIF: null,
          })
        )})`}</span>
      </Link>
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "Journal IF" });
        }}
        to={props.makeNewFilterLink({
          journalIFFrom: 1,
          journalIFTo: undefined,
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: articleSearchState.IFFilterFromValue === 1 && !articleSearchState.IFFilterToValue,
        })}
      >
        <span className={styles.linkTitle}>More than 1</span>
        <span className={styles.countBox}>{`(${formatNumber(
          calculateIFCount({
            rangeSetList: IFRange,
            minIF: 1,
            maxIF: null,
          })
        )})`}</span>
      </Link>
      <div
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.rangeFilterItem}`]: true,
          [`${styles.isSelected}`]: !!articleSearchState.IFFilterFromValue && !!articleSearchState.IFFilterToValue,
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
          value={articleSearchState.IFFilterFromValue}
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
          value={articleSearchState.IFFilterToValue}
        />
        <Link
          onClick={() => {
            trackEvent({ category: "Search", action: "Filter", label: "Journal IF" });
          }}
          className={styles.yearSubmitLink}
          to={props.makeNewFilterLink({
            journalIFFrom: articleSearchState.IFFilterFromValue,
            journalIFTo: articleSearchState.IFFilterToValue,
          })}
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

function getFOSFilterBox(props: FilterContainerProps) {
  const { articleSearchState, handleToggleFilterBox, handleToggleExpandingFilter } = props;
  const fosList = articleSearchState.aggregationData ? articleSearchState.aggregationData.fosList : [];

  if (!articleSearchState.aggregationData || !fosList || fosList.length === 0) {
    return null;
  }

  const pastFosIdList = articleSearchState.fosFilter;
  const targetFOSList = articleSearchState.isFOSFilterExpanding ? fosList : fosList.slice(0, 5);

  const fosItems = targetFOSList.map(fos => {
    const alreadyHasFOSInFilter = pastFosIdList.includes(fos!.id);
    const newFOSFilterArray = toggleElementFromArray<number>(fos!.id, pastFosIdList);

    return (
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "FoS" });
        }}
        key={`fos_${fos!.id}`}
        to={props.makeNewFilterLink({
          fos: newFOSFilterArray as number[],
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: alreadyHasFOSInFilter,
        })}
      >
        <Checkbox
          classes={{
            root: styles.checkboxIcon,
            checked: styles.checkedCheckboxIcon,
          }}
          checked={alreadyHasFOSInFilter}
        />
        <span className={styles.linkTitle}>{fos!.name}</span>
        <span className={styles.countBox}>{`(${formatNumber(fos!.doc_count)})`}</span>
      </Link>
    );
  });

  const moreButton =
    fosList.length <= 5 ? null : (
      <div
        onClick={() => {
          handleToggleExpandingFilter(FILTER_TYPE_HAS_EXPANDING_OPTION.FOS);
        }}
        className={styles.moreItem}
      >
        {articleSearchState.isFOSFilterExpanding ? "Show less" : "Show more"}
      </div>
    );

  return (
    <div
      className={classNames({
        [`${styles.filterBox}`]: true,
        [`${styles.FOSFilterOpen}`]: articleSearchState.isFOSFilterOpen,
        [`${styles.ExpandingFOSFilter}`]: articleSearchState.isFOSFilterOpen && articleSearchState.isFOSFilterExpanding,
      })}
    >
      <div
        className={styles.filterTitleBox}
        onClick={() => {
          handleToggleFilterBox(FILTER_BOX_TYPE.FOS);
        }}
      >
        <div className={styles.filterTitle}>Field of study</div>
        <span
          className={classNames({
            [`${styles.toggleBoxIconWrapper}`]: true,
            [`${styles.isClosed}`]: articleSearchState.isFOSFilterOpen,
          })}
        >
          <Icon icon="ARROW_POINT_TO_UP" />
        </span>
      </div>
      {fosItems}
      {moreButton}
    </div>
  );
}

function getJournalFilter(props: FilterContainerProps) {
  const { articleSearchState, handleToggleFilterBox, handleToggleExpandingFilter } = props;

  const journals = articleSearchState.aggregationData ? articleSearchState.aggregationData.journals : [];

  if (!articleSearchState.aggregationData || !journals || journals.length === 0) {
    return null;
  }

  const journalIdList = articleSearchState.journalFilter;
  const targetJournals = articleSearchState.isJournalFilterExpanding ? journals : journals.slice(0, 5);
  const journalItems = targetJournals.map(journal => {
    const alreadyHasJournalInFilter = journalIdList.includes(journal!.id);
    const newJournalFilterArray = toggleElementFromArray<number>(journal!.id, journalIdList);

    return (
      <Link
        onClick={() => {
          trackEvent({ category: "Search", action: "Filter", label: "Journal" });
        }}
        key={`journal_${journal!.id}`}
        to={props.makeNewFilterLink({
          journal: newJournalFilterArray as number[],
        })}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: alreadyHasJournalInFilter,
        })}
      >
        <Checkbox
          classes={{
            root: styles.checkboxIcon,
            checked: styles.checkedCheckboxIcon,
          }}
          checked={alreadyHasJournalInFilter}
        />
        <span className={styles.linkTitle}>{journal!.title}</span>
        <span className={styles.countBox}>{`(${formatNumber(journal!.doc_count)})`}</span>
      </Link>
    );
  });

  const moreButton =
    journals.length <= 5 ? null : (
      <div
        onClick={() => {
          handleToggleExpandingFilter(FILTER_TYPE_HAS_EXPANDING_OPTION.JOURNAL);
        }}
        className={styles.moreItem}
      >
        {articleSearchState.isJournalFilterExpanding ? "Show less" : "Show more"}
      </div>
    );

  return (
    <div
      className={classNames({
        [`${styles.filterBox}`]: true,
        [`${styles.isJournalFilterOpen}`]: articleSearchState.isJournalFilterOpen,
        [`${styles.ExpandingJournalFilter}`]:
          articleSearchState.isJournalFilterOpen && articleSearchState.isJournalFilterExpanding,
      })}
    >
      <div
        className={styles.filterTitleBox}
        onClick={() => {
          handleToggleFilterBox(FILTER_BOX_TYPE.JOURNAL);
        }}
      >
        <div className={styles.filterTitle}>Journal</div>
        <span
          className={classNames({
            [`${styles.toggleBoxIconWrapper}`]: true,
            [`${styles.isClosed}`]: articleSearchState.isJournalFilterOpen,
          })}
        >
          <Icon icon="ARROW_POINT_TO_UP" />
        </span>
      </div>
      {journalItems}
      {moreButton}
    </div>
  );
}

class FilterContainer extends React.PureComponent<FilterContainerProps, {}> {
  public render() {
    if (!this.props.articleSearchState.aggregationData) {
      return null;
    }

    if (!this.props.articleSearchState.isFilterAvailable) {
      return <div className={styles.filterContainer}>{getPublicationFilterBox(this.props)}</div>;
    }

    return (
      <div className={styles.filterContainer}>
        {getPublicationFilterBox(this.props)}
        {getJournalIFFilterBox(this.props)}
        {getFOSFilterBox(this.props)}
        {getJournalFilter(this.props)}
      </div>
    );
  }
}

export default withStyles<typeof FilterContainer>(styles)(FilterContainer);
