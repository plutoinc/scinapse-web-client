import * as React from "react";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "../../helpers/withStylesHelper";
import { ChangeRangeInputParams } from "../../constants/paperSearch";
import { FilterObject } from "../../helpers/papersQueryFormatter";
import { trackSelectFilter } from "../../components/filterContainer/trackSelectFilter";
import { ArticleSearchState } from "../../components/articleSearch/records";
import formatNumber from "../../helpers/formatNumber";
import { toggleElementFromArray } from "../../helpers/toggleElementFromArray";
import Icon from "../../icons";
import YearRangeSlider from "./yearRangeSlider";
const styles = require("./filterContainer.scss");

export interface FilterContainerProps {
  handleChangeRangeInput: (params: ChangeRangeInputParams) => void;
  makeNewFilterLink: (newFilter: FilterObject) => string;
  articleSearchState: ArticleSearchState;
}

function getPublicationFilterBox(props: FilterContainerProps) {
  const { articleSearchState } = props;
  const yearRangeList = articleSearchState.aggregationData ? articleSearchState.aggregationData.yearAll || [] : [];
  const filteredYearRangeList = articleSearchState.aggregationData
    ? articleSearchState.aggregationData.yearFiltered || []
    : [];
  return <YearRangeSlider yearInfo={yearRangeList} filteredYearInfo={filteredYearRangeList} />;
}

function getFOSFilterBox(props: FilterContainerProps) {
  const { articleSearchState } = props;
  const fosList = articleSearchState.aggregationData ? articleSearchState.aggregationData.fosList : [];

  if (!articleSearchState.aggregationData || !fosList || fosList.length === 0) {
    return null;
  }

  const pastFosIdList = articleSearchState.fosFilter;
  const targetFOSList = fosList.slice(0, 6);

  const fosItems = targetFOSList.slice(0, 10).map(fos => {
    const alreadyHasFOSInFilter = pastFosIdList.includes(fos!.id);
    const newFOSFilterArray = toggleElementFromArray<number>(fos!.id, pastFosIdList);

    return (
      <Link
        onClick={() => {
          trackSelectFilter("FOS", fos!.name);
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
        <span className={styles.countBox}>{`(${formatNumber(fos!.docCount)})`}</span>
      </Link>
    );
  });

  return (
    <div className={styles.filterBox}>
      <div className={styles.filterTitleBox}>
        <div className={styles.filterTitle}>Field of study</div>
        <span className={styles.resetButtonWrapper}>Reset</span>
      </div>
      {fosItems}
    </div>
  );
}

function getJournalFilter(props: FilterContainerProps) {
  const { articleSearchState } = props;

  const journals = articleSearchState.aggregationData ? articleSearchState.aggregationData.journals : [];

  if (!articleSearchState.aggregationData || !journals || journals.length === 0) {
    return null;
  }

  const journalIdList = articleSearchState.journalFilter;
  const targetJournals = journals.slice(0, 6);
  const journalItems = targetJournals.map(journal => {
    const alreadyHasJournalInFilter = journalIdList.includes(journal!.id);
    const newJournalFilterArray = toggleElementFromArray<number>(journal!.id, journalIdList);

    return (
      <Link
        onClick={() => {
          trackSelectFilter("JOURNAL", journal!.title);
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
        <span className={styles.linkTitle}>
          {journal!.title} {journal!.impactFactor ? `[IF : ${journal!.impactFactor.toFixed(2)}]` : ""}
        </span>
        <span className={styles.countBox}>{`(${formatNumber(journal!.docCount)})`}</span>
      </Link>
    );
  });

  return (
    <div className={styles.filterBox}>
      <div className={styles.filterTitleBox}>
        <div className={styles.filterTitle}>Journal</div>
        <span className={styles.resetButtonWrapper}>Reset</span>
      </div>
      {journalItems}
    </div>
  );
}

const FilterContainer: React.FunctionComponent<FilterContainerProps> = props => {
  if (!props.articleSearchState.aggregationData) {
    return null;
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterContainerTitleBox}>
        <Icon className={styles.filterResultButton} icon="FILTER_RESULT_BUTTON" />
        <span className={styles.filterContainerTitle}>PAPER FILTERS</span>
      </div>
      {getPublicationFilterBox(props)}
      {getFOSFilterBox(props)}
      {getJournalFilter(props)}
    </div>
  );
};

export default withStyles<typeof FilterContainer>(styles)(FilterContainer);
