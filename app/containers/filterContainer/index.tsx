import * as React from "react";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "../../helpers/withStylesHelper";
import { ChangeRangeInputParams, FILTER_RANGE_TYPE, FILTER_TYPE_HAS_RANGE } from "../../constants/paperSearch";
import YearFilter from "../../components/filterContainer/yearFilter";
import { FilterObject } from "../../helpers/papersQueryFormatter";
import { trackSelectFilter } from "../../components/filterContainer/trackSelectFilter";
import { ArticleSearchState } from "../../components/articleSearch/records";
import formatNumber from "../../helpers/formatNumber";
import { toggleElementFromArray } from "../../helpers/toggleElementFromArray";
import Icon from "../../icons";
import FilterResetButton from "../../components/filterContainer/filterResetButton";
const styles = require("./filterContainer.scss");

export interface FilterContainerProps {
  handleChangeRangeInput: (params: ChangeRangeInputParams) => void;
  handleToggleExpandingFilter: () => void;
  makeNewFilterLink: (newFilter: FilterObject) => string;
  articleSearchState: ArticleSearchState;
}

interface YearSet {
  year: number;
  docCount: number;
}

interface CalculateYearsCountParams {
  rangeSetList: YearSet[];
  minYear: number;
}

function calculateYearsCount({ rangeSetList, minYear }: CalculateYearsCountParams) {
  const targetList = rangeSetList.filter(rangeSet => {
    return rangeSet.year >= minYear;
  });

  return targetList.reduce((a, b) => {
    return a! + b!.docCount;
  }, 0);
}

function getPublicationFilterBox(props: FilterContainerProps) {
  const { articleSearchState, makeNewFilterLink, handleChangeRangeInput } = props;

  const currentYear = new Date().getFullYear();
  const fromToCurrentYearDiff = currentYear - articleSearchState.yearFilterFromValue;

  const overallFieldData = articleSearchState.aggregationData
    ? articleSearchState.aggregationData.years.find(year => year.year === null)
    : null;
  const paperCountOfAllFilter = overallFieldData ? overallFieldData.docCount : 0;

  const yearRangeList = articleSearchState.aggregationData ? articleSearchState.aggregationData.years : [];

  return (
    <div className={styles.filterBox}>
      <div className={styles.filterTitleBox}>
        <div className={styles.filterTitle}>Publication Year</div>
        <FilterResetButton filterType="PUBLISHED_YEAR" makeNewFilterLink={makeNewFilterLink} />
      </div>
      <Link
        onClick={() => {
          trackSelectFilter("PUBLISHED_YEAR", "all");
        }}
        className={classNames({
          [`${styles.filterItem}`]: true,
          [`${styles.isSelected}`]: !articleSearchState.yearFilterFromValue && !articleSearchState.yearFilterToValue,
        })}
        to={makeNewFilterLink({
          yearFrom: undefined,
          yearTo: undefined,
        })}
      >
        <span className={styles.linkTitle}>All</span>
        <span className={styles.countBox}>{`(${formatNumber(paperCountOfAllFilter)})`}</span>
      </Link>
      <YearFilter
        fromNow={3}
        isSelected={fromToCurrentYearDiff === 3 && !articleSearchState.yearFilterToValue}
        paperCount={`(${formatNumber(
          calculateYearsCount({
            rangeSetList: yearRangeList,
            minYear: currentYear - 3,
          })
        )})`}
        to={makeNewFilterLink({
          yearFrom: currentYear - 3,
          yearTo: undefined,
        })}
      />
      <YearFilter
        fromNow={5}
        isSelected={fromToCurrentYearDiff === 5 && !articleSearchState.yearFilterToValue}
        paperCount={`(${formatNumber(
          calculateYearsCount({
            rangeSetList: yearRangeList,
            minYear: currentYear - 5,
          })
        )})`}
        to={makeNewFilterLink({
          yearFrom: currentYear - 5,
          yearTo: undefined,
        })}
      />
      <YearFilter
        fromNow={10}
        isSelected={fromToCurrentYearDiff === 10 && !articleSearchState.yearFilterToValue}
        paperCount={`(${formatNumber(
          calculateYearsCount({
            rangeSetList: yearRangeList,
            minYear: currentYear - 10,
          })
        )})`}
        to={makeNewFilterLink({
          yearFrom: currentYear - 10,
          yearTo: undefined,
        })}
      />
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
            trackSelectFilter(
              "PUBLISHED_YEAR",
              `${articleSearchState.yearFilterFromValue} ~ ${articleSearchState.yearFilterToValue}`
            );
          }}
          className={styles.yearSubmitLink}
          to={makeNewFilterLink({
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

function getFOSFilterBox(props: FilterContainerProps) {
  const { articleSearchState, makeNewFilterLink } = props;
  const fosList = articleSearchState.aggregationData ? articleSearchState.aggregationData.fosList : [];

  if (!articleSearchState.aggregationData || !fosList || fosList.length === 0) {
    return null;
  }

  const pastFosIdList = articleSearchState.fosFilter;
  const targetFOSList = fosList.slice(0, 6);

  const fosItems = targetFOSList.map(fos => {
    const alreadyHasFOSInFilter = pastFosIdList.includes(fos!.id);
    const newFOSFilterArray = toggleElementFromArray<number>(fos!.id, pastFosIdList);
    const fosCount = formatNumber(fos!.docCount);

    return (
      <Link
        onClick={() => {
          trackSelectFilter("FOS", fos!.name);
        }}
        key={`fos_${fos!.id}`}
        to={makeNewFilterLink({
          fos: newFOSFilterArray as number[],
        })}
        className={classNames({
          [styles.filterItem]: true,
          [styles.isSelected]: alreadyHasFOSInFilter,
          [styles.zeroCountFilterItem]: fosCount === "0",
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
        <span className={styles.countBox}>{`(${fosCount})`}</span>
      </Link>
    );
  });

  return (
    <div className={styles.filterBox}>
      <div className={styles.filterTitleBox}>
        <div className={styles.filterTitle}>Field of study</div>
        <FilterResetButton filterType="FOS" makeNewFilterLink={makeNewFilterLink} />
      </div>
      {fosItems}
    </div>
  );
}

function getJournalFilter(props: FilterContainerProps) {
  const { articleSearchState, makeNewFilterLink, handleToggleExpandingFilter } = props;

  const journals = articleSearchState.aggregationData ? articleSearchState.aggregationData.journals : [];

  if (!articleSearchState.aggregationData || !journals || journals.length === 0) {
    return null;
  }

  const journalIdList = articleSearchState.journalFilter;
  const targetJournals = articleSearchState.isJournalFilterExpanding ? journals : journals.slice(0, 6);
  const journalItems = targetJournals.map(journal => {
    const alreadyHasJournalInFilter = journalIdList.includes(journal!.id);
    const newJournalFilterArray = toggleElementFromArray<number>(journal!.id, journalIdList);
    const journalCount = formatNumber(journal!.docCount);

    return (
      <Link
        onClick={() => {
          trackSelectFilter("JOURNAL", journal!.title);
        }}
        key={`journal_${journal!.id}`}
        to={makeNewFilterLink({
          journal: newJournalFilterArray as number[],
        })}
        className={classNames({
          [styles.filterItem]: true,
          [styles.isSelected]: alreadyHasJournalInFilter,
          [styles.zeroCountFilterItem]: journalCount === "0",
        })}
      >
        <Checkbox
          classes={{
            root: styles.checkboxIcon,
            checked: styles.checkedCheckboxIcon,
          }}
          checked={alreadyHasJournalInFilter}
        />
        <span className={styles.linkTitle}>
          {journal!.title}
          <span className={styles.ifLabel}>
            {journal!.impactFactor ? `IF : ${journal!.impactFactor.toFixed(2)}` : ""}
          </span>
        </span>
        <span className={styles.countBox}>{`(${journalCount})`}</span>
      </Link>
    );
  });

  const moreButton =
    journals.length <= 6 ? null : (
      <div
        onClick={() => {
          handleToggleExpandingFilter();
        }}
        className={styles.moreItem}
      >
        {articleSearchState.isJournalFilterExpanding ? "Show less" : "Show more"}
      </div>
    );

  return (
    <div
      className={classNames({
        [styles.filterBox]: true,
        [styles.ExpandingJournalFilter]: articleSearchState.isJournalFilterExpanding,
      })}
    >
      <div className={styles.filterTitleBox}>
        <div className={styles.filterTitle}>Journal</div>
        <FilterResetButton filterType="JOURNAL" makeNewFilterLink={makeNewFilterLink} />
      </div>
      {journalItems}
      {moreButton}
    </div>
  );
}

const FilterContainer: React.FunctionComponent<FilterContainerProps> = props => {
  const { articleSearchState, makeNewFilterLink } = props;
  if (!articleSearchState.aggregationData) {
    return null;
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterContainerTitleBox}>
        <div className={styles.filterTitleBox}>
          <Icon className={styles.filterResultButton} icon="FILTER_RESULT_BUTTON" />
          <span className={styles.filterContainerTitle}>PAPER FILTERS</span>
          <FilterResetButton makeNewFilterLink={makeNewFilterLink} />
        </div>
      </div>
      {getPublicationFilterBox(props)}
      {getFOSFilterBox(props)}
      {getJournalFilter(props)}
    </div>
  );
};

export default withStyles<typeof FilterContainer>(styles)(FilterContainer);
