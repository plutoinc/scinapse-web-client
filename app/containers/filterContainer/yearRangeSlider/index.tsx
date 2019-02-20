import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./yearRangeSlider.scss");

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

const Slider: React.FunctionComponent<{
  minValue: number;
  maxValue: number;
}> = props => {
  return (
    <div className={styles.slider}>
      <div
        draggable
        onDragStart={e => {
          console.log(e);
          e.dataTransfer.setData("text/plain", "start");
        }}
        style={{ left: 0 }}
        className={styles.sliderBubble}
      />
      <div
        draggable
        onDragStart={e => {
          console.log(e);
          e.dataTransfer.setData("text/plain", "start");
        }}
        style={{ right: 0 }}
        className={styles.sliderBubble}
      />
    </div>
  );
};

const YearRangeSlider: React.FunctionComponent<YearRangeSliderProps> = props => {
  if (!props.yearInfo) return null;
  const yearInfoWithoutAll = props.yearInfo.filter(yearSet => !!yearSet.year);
  const yearSetSortByYear = [...yearInfoWithoutAll].sort((a, b) => {
    if (a.year < b.year) {
      return -1;
    }
    if (a.year > b.year) {
      return 1;
    }
    return 0;
  });

  const [minValue, setMinValue] = React.useState(yearSetSortByYear[0].year);
  const [maxValue, setMaxValue] = React.useState(yearSetSortByYear[yearSetSortByYear.length - 1].year);

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

  return (
    <div
      onDragOver={e => {
        e.preventDefault();
        console.log(e);
      }}
      className={styles.yearFilterBox}
    >
      <div className={styles.columnBox}>
        {yearSetSortByYear.map((yearSet, i) => {
          return (
            <Column
              key={i}
              width={`${Math.floor(336 / yearSetSortByYear.length)}px`}
              height={`${(yearSet.docCount / maxYearSet.docCount) * 100}%`}
              active={minValue <= yearSet.year && yearSet.year <= maxValue}
              onClick={() => {
                setMinValue(yearSet.year);
                setMaxValue(yearSet.year);
              }}
            />
          );
        })}
      </div>
      <div className={styles.droppable}>
        <Slider minValue={minValue} maxValue={maxValue} />
      </div>
    </div>
  );
};

export default withStyles<typeof YearRangeSlider>(styles)(YearRangeSlider);
