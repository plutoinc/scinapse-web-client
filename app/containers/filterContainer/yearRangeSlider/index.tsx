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
}

const Column: React.FunctionComponent<{
  width: string;
  height: string;
  active: boolean;
  yearSet: YearSet;
  isSelecting: boolean;
  onClick: () => void;
}> = props => {
  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        backgroundColor: props.active ? "#6096ff" : "#d8dde7",
        borderRight: "solid 1px #f9f9fa",
      }}
      className={styles.column}
      onClick={props.onClick}
    >
      <div
        className={classNames({
          [styles.columnLabel]: true,
          [styles.isSelecting]: props.isSelecting,
        })}
      >
        <div className={styles.docCount}>{`${props.yearSet.docCount} Papers`}</div>
        <div className={styles.yearNum}>{`${props.yearSet.year} Year`}</div>
      </div>
    </div>
  );
};

const Slider: React.FunctionComponent<{
  values: number[];
  step: number;
  minValue: number;
  maxValue: number;
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
        left={(cv - MIN_YEAR) * props.step}
        value={cv}
        onSelectingColumn={props.onSelectingColumn}
      />
    );
  });

  return <div className={styles.slider}>{bubbles}</div>;
};

const YearRangeSlider: React.FunctionComponent<YearRangeSliderProps> = props => {
  if (!props.yearInfo) return null;

  const yearInfoWithoutAll = props.yearInfo.filter(yearSet => !!yearSet.year && yearSet.year >= 1960);
  const yearSetSortByYear = [...yearInfoWithoutAll].sort((a, b) => {
    if (a.year < b.year) {
      return -1;
    }
    if (a.year > b.year) {
      return 1;
    }
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
  const maxYearSet = [...yearInfoWithoutAll].sort((a, b) => {
    if (a.docCount > b.docCount) {
      return -1;
    } else if (a.docCount === b.docCount) {
      return 0;
    } else {
      return 1;
    }
  })[0];

  const stepWidth = Math.floor(336 / yearSetSortByYear.length);

  return (
    <div
      onDragOver={e => {
        e.preventDefault();
      }}
      className={styles.yearFilterBox}
    >
      <div className={styles.columnBox}>
        {yearSetSortByYear.map(yearSet => {
          return (
            <Column
              key={yearSet.year}
              width={`${stepWidth}px`}
              height={`${(yearSet.docCount / maxYearSet.docCount) * 100}%`}
              active={minValue <= yearSet.year && yearSet.year <= maxValue}
              isSelecting={selectingColumn === yearSet.year}
              yearSet={yearSet}
              onClick={() => {
                setValues([yearSet.year, yearSet.year]);
              }}
            />
          );
        })}
      </div>
      <div className={styles.droppable}>
        <Slider
          minValue={minValue}
          maxValue={maxValue}
          values={values}
          setValues={setValues}
          step={stepWidth}
          onSelectingColumn={setSelectingColumn}
        />
      </div>
    </div>
  );
};

export default withRouter(withStyles<typeof YearRangeSlider>(styles)(YearRangeSlider));
