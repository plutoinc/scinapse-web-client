import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { MIN_YEAR } from "./constants";
import PapersQueryFormatter, { SearchPageQueryParamsObject } from "../../../helpers/papersQueryFormatter";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import { SearchPageQueryParams } from "../../../components/articleSearch/types";
const styles = require("./yearRangeSlider.scss");

interface SliderBubbleProps extends RouteComponentProps<null> {
  value: number;
  left: number;
  step: number;
  min: number;
  max: number;
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
  onSelectingColumn: React.Dispatch<React.SetStateAction<number>>;
}

const SliderBubble: React.FunctionComponent<SliderBubbleProps> = props => {
  function handleDragEvent(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const diff = e.screenX - Math.round(e.currentTarget.getBoundingClientRect().left);
    const fromLeft = e.currentTarget.offsetLeft + diff;
    const nextStep = Math.floor(fromLeft / props.step);

    let nextValue: number = nextStep + MIN_YEAR;
    if (nextValue < MIN_YEAR) {
      nextValue = MIN_YEAR;
    } else if (nextValue > currentYear) {
      nextValue = currentYear;
    }

    let nextValues: number[];
    if (props.value === props.min) {
      if (nextValue < props.max) {
        nextValues = [nextValue, props.max];
      } else if (nextValue > props.max) {
        nextValues = [props.min, nextValue];
      } else {
        // nextValue === props.max
        nextValues = [props.min, nextValue];
      }
    } else {
      // currentValue is Max Value
      if (nextValue < props.min) {
        nextValues = [nextValue, props.max];
      } else if (nextValue > props.min) {
        nextValues = [props.min, nextValue];
      } else {
        // nextValue === props.min
        nextValues = [nextValue, props.max];
      }
    }

    props.setValues(nextValues);
    props.onSelectingColumn(nextValue);

    if (e.type === "dragend") {
      props.onSelectingColumn(0);

      const qp: SearchPageQueryParams = getQueryParamsObject(props.location.search);
      const filter = PapersQueryFormatter.objectifyPapersFilter(qp.filter);
      const newFilter = { ...filter, yearFrom: Math.min(...nextValues), yearTo: Math.max(...nextValues) };
      const newQP: SearchPageQueryParamsObject = {
        query: qp.query || "",
        filter: newFilter,
        page: parseInt(qp.page || "1", 10),
        sort: qp.sort || "RELEVANCE",
      };
      const newSearch = PapersQueryFormatter.stringifyPapersQuery(newQP);
      props.history.push({
        pathname: `/search`,
        search: newSearch,
      });
    }
  }

  return (
    <div
      draggable
      onDrag={handleDragEvent}
      onDragEnd={handleDragEvent}
      style={{ left: `${props.left}px` }}
      className={styles.sliderBubble}
    >
      <div className={styles.bubbleLabel}>{props.value}</div>
    </div>
  );
};

export default withRouter(SliderBubble);
