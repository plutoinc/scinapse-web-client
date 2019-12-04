import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
import { Year } from '../../model/aggregation';
import formatNumber from '../../helpers/formatNumber';
const s = require('./yearGraph.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

const YearGraph: FC = () => {
  useStyles(s);
  const [currentYearSet, setCurrentYearSet] = useState<Year | null>(null);

  const allYears = useSelector((state: AppState) => state.searchFilterState.yearAll);

  const maxWidth = 180; // px
  const maxHeight = 100; // px

  if (!allYears || !allYears.length) return null;

  const targetYears = allYears.filter(yearSet => yearSet.year >= 1980);
  const maxCount = Math.max(...targetYears.map(yearSet => yearSet.docCount));

  const widthUnit = Math.floor(maxWidth / targetYears.length);
  const heightUnit = maxHeight / maxCount;

  /*
    why LeftSpace?
    because we calculate widthUnit with 'floor'
  */
  const leftSpace = (maxWidth - widthUnit * targetYears.length) / 2;

  const rects = targetYears.map((yearSet, i) => {
    const height = heightUnit * yearSet.docCount;

    return (
      <g
        onMouseEnter={() => setCurrentYearSet(yearSet)}
        onMouseLeave={() => setCurrentYearSet(null)}
        className={s.boxWrapper}
        key={i}
      >
        <rect
          className={s.column}
          height={height}
          x={i * widthUnit + leftSpace}
          y={maxHeight - height}
          width={widthUnit}
        />
      </g>
    );
  });

  return (
    <div className={s.wrapper} style={{ width: maxWidth, margin: '0 auto' }}>
      <svg width={maxWidth} height={maxHeight} role="img">
        {rects}
      </svg>
      <div className={s.labelWrapper}>
        {currentYearSet && (
          <div className={s.currentLabelWrapper}>
            <div className={s.labelText}>{`year: ${currentYearSet.year}`}</div>
            <div className={s.labelText}>{`count: ${formatNumber(currentYearSet.docCount)}`}</div>
          </div>
        )}

        <div
          style={{
            left: '-14px',
          }}
          className={s.yearLabel}
        >
          {targetYears[0].year}
        </div>
        <div
          style={{
            right: '-14px',
          }}
          className={s.yearLabel}
        >
          {targetYears[targetYears.length - 1].year}
        </div>
      </div>
    </div>
  );
};

export default YearGraph;
