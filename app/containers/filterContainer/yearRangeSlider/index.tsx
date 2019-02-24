import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { MIN_YEAR } from "./constants";
import Slider from "./slider";
import { SearchPageQueryParams } from "../../../components/articleSearch/types";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { goToYearFilteredSearchResultPage } from "./helper";
import FilterButton from "../filterButton";
const styles = require("./yearRangeSlider.scss");

interface YearSet {
  year: number;
  docCount: number;
}

interface YearRangeSliderProps extends RouteComponentProps<null> {
  yearInfo: YearSet[];
  filteredYearInfo: YearSet[];
}

const Column: React.FunctionComponent<{
  width: string;
  height: string;
  active: boolean;
  yearSet: YearSet;
  isSelecting: boolean;
  isSelectMode: boolean;
  filteredYearSet: YearSet | undefined;
  filterHeight: string;
  onClick: () => void;
}> = props => {
  return (
    <>
      {props.filteredYearSet &&
        props.filteredYearSet.docCount > 0 && (
          <div
            style={{
              width: props.width,
              height: props.filterHeight,
              backgroundColor: "#3e7fff",
              borderRight: "solid 1px #f9f9fa",
            }}
            className={styles.filterColumn}
            onClick={props.onClick}
          />
        )}
      <div
        style={{
          width: props.width,
          height: props.height,
          backgroundColor: props.active ? "rgba(96, 150, 255, 0.5)" : "#d8dde7",
          borderRight: "solid 1px #f9f9fa",
        }}
        className={styles.column}
        onClick={props.onClick}
      >
        <div
          className={classNames({
            [styles.columnLabel]: true,
            [styles.isSelectMode]: props.isSelectMode,
            [styles.isSelecting]: props.isSelecting,
          })}
        >
          <div className={styles.docCount}>{`${props.yearSet.docCount} Papers`}</div>
          <div className={styles.yearNum}>{`${props.yearSet.year} Year`}</div>
        </div>
      </div>
    </>
  );
};

const YearRangeSlider: React.FunctionComponent<YearRangeSliderProps> = props => {
  const yearSetListToShow = props.yearInfo.filter(yearSet => !!yearSet.year && yearSet.year >= MIN_YEAR);
  const yearSetSortByYear = [...yearSetListToShow].sort((a, b) => {
    if (a.year < b.year) return -1;
    if (a.year > b.year) return 1;
    return 0;
  });

  const qp: SearchPageQueryParams = getQueryParamsObject(props.location.search);
  const filter = PapersQueryFormatter.objectifyPapersFilter(qp.filter);
  const minYear =
    filter.yearFrom && !isNaN(filter.yearFrom as number) ? (filter.yearFrom as number) : yearSetSortByYear[0].year;
  const maxYear =
    filter.yearTo && !isNaN(filter.yearTo as number)
      ? (filter.yearTo as number)
      : yearSetSortByYear[yearSetSortByYear.length - 1].year;

  const [values, setValues] = React.useState([minYear, maxYear]);
  const [selectingColumn, setSelectingColumn] = React.useState(0);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const currentYaer = new Date().getFullYear();
  const maxDocCount = Math.max(...yearSetListToShow.map(yearSet => yearSet.docCount));
  const columnBoxNode = React.useRef<HTMLDivElement | null>(null);
  const boxWidth = columnBoxNode.current ? columnBoxNode.current.offsetWidth : 304;
  const stepWidth = Math.floor(boxWidth / yearSetSortByYear.length);
  console.log(currentYaer, minValue, maxValue);

  return (
    <div className={styles.yearFilter}>
      <div className={styles.content}>
        <div className={styles.title}>
          Published Year
          <div
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: props.location.search,
                history: props.history,
                max: yearSetSortByYear[yearSetSortByYear.length - 1].year,
                min: yearSetSortByYear[0].year,
              });
            }}
            className={styles.resetBtn}
          >
            Reset
          </div>
        </div>

        <div className={styles.btnsWrapper}>
          <FilterButton
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: props.location.search,
                history: props.history,
                max: maxValue,
                min: currentYaer,
              });
            }}
            isActive={minValue === currentYaer && maxValue === currentYaer}
            text="This Year"
          />
          <FilterButton
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: props.location.search,
                history: props.history,
                max: maxValue,
                min: currentYaer - 3,
              });
            }}
            isActive={minValue === currentYaer - 3 && maxValue === currentYaer}
            text="Last 3 Years"
          />
          <FilterButton
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: props.location.search,
                history: props.history,
                max: maxValue,
                min: currentYaer - 5,
              });
            }}
            isActive={minValue === currentYaer - 5 && maxValue === currentYaer}
            text="Last 5 Years"
          />
        </div>

        <div className={styles.yearFilterBox}>
          <div ref={columnBoxNode} className={styles.columnBox}>
            {yearSetSortByYear.map(yearSet => {
              const filteredYearSet = props.filteredYearInfo.find(ys => ys.year === yearSet.year);
              const filterHeight = filteredYearSet
                ? `${Math.round((filteredYearSet.docCount / maxDocCount) * 100)}%`
                : "0px";
              return (
                <Column
                  key={yearSet.year}
                  width={`${stepWidth}px`}
                  height={`${Math.round((yearSet.docCount / maxDocCount) * 100)}%`}
                  active={minValue <= yearSet.year && yearSet.year <= maxValue}
                  isSelecting={selectingColumn === yearSet.year}
                  isSelectMode={selectingColumn !== 0}
                  yearSet={yearSet}
                  filteredYearSet={filteredYearSet}
                  filterHeight={filterHeight}
                  onClick={() => {
                    setValues([yearSet.year, yearSet.year]);
                    goToYearFilteredSearchResultPage({
                      qs: props.location.search,
                      min: yearSet.year,
                      max: yearSet.year,
                      history: props.history,
                    });
                  }}
                />
              );
            })}
          </div>
          <Slider
            minLimitValue={yearSetSortByYear[0].year}
            minValue={minValue}
            maxValue={maxValue}
            values={values}
            setValues={setValues}
            step={stepWidth}
            onSelectingColumn={setSelectingColumn}
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(withStyles<typeof YearRangeSlider>(styles)(YearRangeSlider));
