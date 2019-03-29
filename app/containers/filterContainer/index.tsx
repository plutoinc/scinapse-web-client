import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import * as classNames from "classnames";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "../../helpers/withStylesHelper";
import { ChangeRangeInputParams } from "../../constants/paperSearch";
import { trackSelectFilter } from "../../components/filterContainer/trackSelectFilter";
import { ArticleSearchState } from "../../components/articleSearch/records";
import formatNumber from "../../helpers/formatNumber";
import { toggleElementFromArray } from "../../helpers/toggleElementFromArray";
import FilterResetButton from "../../components/filterContainer/filterResetButton";
import YearRangeSlider from "./yearRangeSlider";
import Icon from "../../icons";
import EnvChecker from "../../helpers/envChecker";
import FilterSaveBox from "./filterSaveBox";
import makeNewFilterLink from "../../helpers/makeNewFilterLink";
import { CurrentUser } from "../../model/currentUser";
import AutocompleteFilter from "./autocompleteFilter";
const styles = require("./filterContainer.scss");

export interface FilterContainerProps extends RouteComponentProps<any> {
  handleChangeRangeInput: (params: ChangeRangeInputParams) => void;
  handleToggleExpandingFilter: () => void;
  articleSearchState: ArticleSearchState;
  currentUserState: CurrentUser;
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
        to={makeNewFilterLink(
          {
            fos: newFOSFilterArray as number[],
          },
          props.location
        )}
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
        <FilterResetButton filterType="FOS" />
      </div>
      <div className={styles.autocompleteFilterWrapper}>
        <AutocompleteFilter type="FOS" />
      </div>
      {fosItems}
    </div>
  );
}

function getJournalFilter(props: FilterContainerProps) {
  const { articleSearchState, handleToggleExpandingFilter } = props;

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
        to={makeNewFilterLink(
          {
            journal: newJournalFilterArray as number[],
          },
          props.location
        )}
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
            {journal!.impactFactor ? (
              <span>
                <Tooltip
                  disableFocusListener={true}
                  disableTouchListener={true}
                  title="Impact Factor"
                  placement="top"
                  classes={{ tooltip: styles.arrowBottomTooltip }}
                >
                  <span>
                    <Icon className={styles.ifIconWrapper} icon="IMPACT_FACTOR" />
                  </span>
                </Tooltip>
                {journal!.impactFactor.toFixed(2)}
              </span>
            ) : (
              ""
            )}
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
        <FilterResetButton filterType="JOURNAL" />
      </div>
      <div className={styles.autocompleteFilterWrapper}>
        <AutocompleteFilter type="JOURNAL" />
      </div>
      {journalItems}
      {moreButton}
    </div>
  );
}

const FilterContainer: React.FunctionComponent<FilterContainerProps> = props => {
  const { articleSearchState } = props;
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(!EnvChecker.isOnServer());
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={classNames({
        [styles.filterContainer]: true,
        [styles.loading]: articleSearchState.isContentLoading,
      })}
    >
      {articleSearchState.isContentLoading ? <div className={styles.filterLoadingWrapper} /> : null}
      <FilterSaveBox />
      {getPublicationFilterBox(props)}
      {getFOSFilterBox(props)}
      {getJournalFilter(props)}
    </div>
  );
};

export default withRouter(withStyles<typeof FilterContainer>(styles)(FilterContainer));
