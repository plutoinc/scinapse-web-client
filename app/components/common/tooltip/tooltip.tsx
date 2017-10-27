import * as React from "react";
import Icon from "../../../icons/index";

const styles = require("./tooltip.scss");

interface ITooltipParams {
  left: number;
  top: number;
  iconTop: number;
  className: string;
  content: string;
}

const Tooltip = (params: ITooltipParams) => {
  let containerClassName = styles.tooltipContainer;
  if (params.className) {
    containerClassName = `${styles.tooltipContainer} ${params.className}`;
  }

  return (
    <div
      className={containerClassName}
      style={{
        left: params.left,
        top: params.top,
      }}
    >
      <div className={styles.innerContainer}>
        <div
          className={styles.tooltipIconWrapper}
          style={{
            top: params.iconTop,
          }}
        >
          <Icon icon="TOOLTIP" />
        </div>
        <div className={styles.tooltipContent}>{params.content}</div>
      </div>
    </div>
  );
};

export default Tooltip;
