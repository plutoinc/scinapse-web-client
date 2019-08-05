import * as React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import Slider from './slider';
import { MIN_YEAR } from './constants';
const styles = require('./yearRangeSlider.scss');

interface YearSet {
  year: number;
  docCount: number;
}

interface YearRangeSliderProps extends RouteComponentProps<null> {
  yearInfo: YearSet[];
  filteredYearInfo: YearSet[];
  yearFrom: number;
  yearTo: number;
  detectedYear: number | null;
  onSetYear: React.Dispatch<React.SetStateAction<number[]>>;
}

interface ColumnProps {
  history: History;
  width: string;
  height: string;
  active: boolean;
  yearSet: YearSet;
  isSelecting: boolean;
  isSelectMode: boolean;
  filteredYearSet: YearSet | undefined;
  filterHeight: string;
}

const Column: React.FunctionComponent<ColumnProps> = React.memo(props => {
  const baseColumnStyle: React.CSSProperties = {
    width: props.width,
    borderRight: 'solid 1px #f8f9fb',
  };
  const filterColumnStyle: React.CSSProperties = {
    ...baseColumnStyle,
    height: props.filterHeight,
    backgroundColor: '#3e7fff',
  };
  const normalColumnStyle: React.CSSProperties = {
    ...baseColumnStyle,
    height: props.height,
  };

  function handleClickColumn() {
    // goToYearFilteredSearchResultPage({
    //     //   qs: props.queryParamsString,
    //     //   history: props.history,
    //     //   min: props.yearSet.year,
    //     //   max: props.yearSet.year,
    //     // });
  }

  return (
    <>
      {props.filteredYearSet &&
        props.active &&
        props.filteredYearSet.docCount > 0 && (
          <div style={filterColumnStyle} className={styles.filterColumn} onClick={handleClickColumn} />
        )}
      <div
        style={normalColumnStyle}
        className={classNames({
          [styles.column]: true,
          [styles.activeColumn]: props.active,
        })}
        onClick={handleClickColumn}
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
});

const YearRangeSlider: React.FunctionComponent<YearRangeSliderProps> = props => {
  const [minMaxYears, setMinMaxYears] = React.useState(getMinMaxYears());
  const [selectingColumn, setSelectingColumn] = React.useState(0);
  const [allYearData, setAllYearData] = React.useState<YearSet[]>(
    props.yearInfo.filter(yearData => yearData.year >= MIN_YEAR)
  );

  function getMinMaxYears() {
    if (props.detectedYear) return [props.detectedYear, props.detectedYear];
    if (props.yearFrom > 0) return [props.yearFrom, props.yearTo];
    return [MIN_YEAR, props.yearInfo[props.yearInfo.length - 1].year];
  }

  React.useEffect(
    () => {
      setMinMaxYears(getMinMaxYears());
    },
    [props.yearFrom, props.yearTo, props.detectedYear]
  );

  React.useEffect(
    () => {
      setAllYearData(props.yearInfo.filter(yearData => yearData.year >= MIN_YEAR));
    },
    [props.yearInfo]
  );

  const minValue = Math.min(...minMaxYears);
  const maxValue = Math.max(...minMaxYears);
  const maxDocCount = React.useMemo(() => Math.max(...allYearData.map(yearSet => yearSet.docCount)), [allYearData]);
  const columnBoxNode = React.useRef<HTMLDivElement | null>(null);
  const boxWidth = columnBoxNode.current ? columnBoxNode.current.offsetWidth : 347;
  const stepWidth = boxWidth / allYearData.length;

  console.log(stepWidth);

  const columnList = React.useMemo(
    () => {
      return allYearData.map(yearSet => {
        const filteredYearSet = props.filteredYearInfo.find(ys => ys.year === yearSet.year);
        const filterHeight = filteredYearSet
          ? `${Math.max(Math.round((filteredYearSet.docCount / maxDocCount) * 100), 4.5)}%`
          : '0px';

        return (
          <Column
            key={yearSet.year}
            history={props.history}
            width={`${stepWidth}px`}
            height={`${Math.round((yearSet.docCount / maxDocCount) * 100)}%`}
            active={minValue <= yearSet.year && yearSet.year <= maxValue}
            isSelecting={selectingColumn === yearSet.year}
            isSelectMode={selectingColumn !== 0}
            yearSet={yearSet}
            filteredYearSet={filteredYearSet}
            filterHeight={filterHeight}
          />
        );
      });
    },
    [allYearData, selectingColumn, minMaxYears, props.filteredYearInfo]
  );
  return (
    <div className={styles.yearFilter}>
      <div className={styles.content}>
        <div className={styles.title}>Published Year</div>

        <div className={styles.yearFilterBox}>
          <div ref={columnBoxNode} className={styles.columnBox}>
            {columnList}
          </div>
          <Slider
            minValue={minValue}
            maxValue={maxValue}
            values={minMaxYears}
            setValues={setMinMaxYears}
            step={stepWidth}
            onSelectingColumn={setSelectingColumn}
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(withStyles<typeof YearRangeSlider>(styles)(YearRangeSlider));
