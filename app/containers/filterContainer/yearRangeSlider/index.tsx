import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { MIN_YEAR } from "./constants";
import SliderBubble from "./sliderBubble";
import { SearchPageQueryParams } from "../../../components/articleSearch/types";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
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

const Slider: React.FunctionComponent<{
  values: number[];
  step: number;
  minValue: number;
  maxValue: number;
  minLimitValue: number;
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
  onSelectingColumn: React.Dispatch<React.SetStateAction<number>>;
}> = props => {
  const bubbles = props.values.map((cv, i) => {
    return (
      <SliderBubble
        key={i}
        min={props.minValue}
        max={props.maxValue}
        setValues={props.setValues}
        step={props.step}
        left={(cv - props.minLimitValue) * props.step}
        value={cv}
        onSelectingColumn={props.onSelectingColumn}
        minLimitValue={props.minLimitValue}
      />
    );
  });

  const minLeft = (props.minValue - props.minLimitValue) * props.step;
  const maxLeft = (props.maxValue - props.minLimitValue) * props.step;
  const activeLineWidth = maxLeft - minLeft;

  return (
    <div className={styles.slider}>
      <div style={{ left: `${minLeft}px`, width: `${activeLineWidth}px` }} className={styles.activeLine} />
      {bubbles}
    </div>
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

  // TODO: Add React Memoized function
  const maxDocCount = Math.max(...yearSetListToShow.map(yearSet => yearSet.docCount));
  const columnBoxNode = React.useRef<HTMLDivElement | null>(null);
  const boxWidth = columnBoxNode.current ? columnBoxNode.current.offsetWidth : 304;
  const stepWidth = Math.floor(boxWidth / yearSetSortByYear.length);

  return (
    <div
      onDragOver={e => {
        e.preventDefault();
        return;
      }}
      onDrop={e => e.preventDefault()}
      className={styles.yearFilterBox}
    >
      <div ref={columnBoxNode} className={styles.columnBox}>
        {yearSetSortByYear.map(yearSet => {
          const filteredYearSet = props.filteredYearInfo.find(ys => ys.year === yearSet.year);
          const filterHeight = filteredYearSet ? `${(filteredYearSet.docCount / maxDocCount) * 100}%` : "0px";
          return (
            <Column
              key={yearSet.year}
              width={`${stepWidth}px`}
              height={`${(yearSet.docCount / maxDocCount) * 100}%`}
              active={minValue <= yearSet.year && yearSet.year <= maxValue}
              isSelecting={selectingColumn === yearSet.year}
              isSelectMode={selectingColumn !== 0}
              yearSet={yearSet}
              filteredYearSet={filteredYearSet}
              filterHeight={filterHeight}
              onClick={() => {
                setValues([yearSet.year, yearSet.year]);
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
  );
};

export default withRouter(withStyles<typeof YearRangeSlider>(styles)(YearRangeSlider));
