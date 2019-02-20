import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./yearRangeSlider.scss");

const MIN_YEAR = 1960;

interface YearSet {
  year: number;
  docCount: number;
}

interface YearRangeSliderProps {
  yearInfo: YearSet[];
}

const Column: React.FunctionComponent<{
  width: string;
  height: string;
  active: boolean;
  onClick: () => void;
}> = props => {
  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        backgroundColor: props.active ? "#6096ff" : "#d8dde7",
      }}
      className={styles.column}
      onClick={props.onClick}
    />
  );
};

const SliderBubble: React.FunctionComponent<{
  value: number;
  left: number;
  step: number;
  min: number;
  max: number;
  limitLeft: number;
  setLeft: React.Dispatch<React.SetStateAction<number>>;
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
}> = props => {
  function handleDragEvent(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (props.min === props.value) {
      const diff = e.screenX - Math.round(e.currentTarget.getBoundingClientRect().left);
      const fromLeft = Math.min(Math.max(e.currentTarget.offsetLeft + diff, 0), props.limitLeft);
      const nextStep = Math.floor(fromLeft / props.step);
      const nextLeft = nextStep * props.step;
      const nextValue = nextStep + MIN_YEAR;
      const nextValues = [nextValue, props.max];
      props.setValues(nextValues);
      props.setLeft(nextLeft);
    } else {
      const diff = e.screenX - Math.round(e.currentTarget.getBoundingClientRect().left);
      const fromLeft = Math.min(e.currentTarget.offsetLeft + diff, props.limitLeft);
      const nextStep = Math.floor(fromLeft / props.step);
      const nextLeft = nextStep * props.step;
      const nextValue = nextStep + MIN_YEAR;
      const nextValues = [props.min, nextValue];
      props.setValues(nextValues);
      props.setLeft(nextLeft);

      console.log(e.clientX, "E.clientX");
      console.log(e.pageX, "pageX");
      console.log(e.screenX, "screenX");
      console.log(e.currentTarget.offsetLeft, "=== offsetleft, ", diff, "=== diff");
      console.log(fromLeft, "fromLeft");
      console.log(diff, "diff");
      console.log(nextStep, "nextStep");
      console.log(nextLeft, "nextLeft");
    }
  }

  return (
    <div
      draggable
      onDrag={handleDragEvent}
      onDragEnd={handleDragEvent}
      style={{ left: `${props.left}px` }}
      className={styles.sliderBubble}
    />
  );
};

const Slider: React.FunctionComponent<{
  values: number[];
  step: number;
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
}> = props => {
  const minValue = Math.min(...props.values);
  const maxValue = Math.max(...props.values);

  const [minLeft, setMinLeft] = React.useState((minValue - MIN_YEAR) * props.step);
  const [maxLeft, setMaxLeft] = React.useState((maxValue - MIN_YEAR) * props.step);
  const currentYear = new Date().getFullYear();
  const limitLeft = (currentYear - MIN_YEAR) * props.step;

  return (
    <div className={styles.slider}>
      <SliderBubble
        min={minValue}
        max={maxValue}
        limitLeft={limitLeft}
        setValues={props.setValues}
        step={props.step}
        setLeft={setMinLeft}
        left={minLeft}
        value={minValue}
      />
      <SliderBubble
        min={minValue}
        max={maxValue}
        limitLeft={limitLeft}
        setValues={props.setValues}
        step={props.step}
        setLeft={setMaxLeft}
        left={maxLeft}
        value={maxValue}
      />
    </div>
  );
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

  const [values, setValues] = React.useState([
    yearSetSortByYear[0].year,
    yearSetSortByYear[yearSetSortByYear.length - 1].year,
  ]);
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
        {yearSetSortByYear.map((yearSet, i) => {
          return (
            <Column
              key={i}
              width={`${stepWidth - 1}px`}
              height={`${(yearSet.docCount / maxYearSet.docCount) * 100}%`}
              active={minValue <= yearSet.year && yearSet.year <= maxValue}
              onClick={() => {
                setValues([yearSet.year, yearSet.year]);
              }}
            />
          );
        })}
      </div>
      <div className={styles.droppable}>
        <Slider values={values} setValues={setValues} step={stepWidth} />
      </div>
    </div>
  );
};

export default withStyles<typeof YearRangeSlider>(styles)(YearRangeSlider);
