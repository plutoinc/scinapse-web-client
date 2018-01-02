import * as React from "react";
import Icon from "../../../icons";

const styles = require("./tooltip.scss");

interface ITooltipParams {
  left: number;
  top: number;
  iconTop: number;
  className: string;
  content: string;
  type: TOOLTIP_TYPE;
}
export type TOOLTIP_TYPE = "normal" | "h-index";
const Tooltip = (params: ITooltipParams) => {
  let containerClassName = styles.tooltipContainer;
  if (params.className) {
    containerClassName = `${styles.tooltipContainer} ${params.className}`;
  }
  let iconName;
  switch (params.type) {
    case "h-index":
      iconName = "H_INDEX_TOOLTIP";
      break;

    default:
      break;
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
          <Icon icon={iconName} />
        </div>
        <div className={styles.tooltipContent}>{params.content}</div>
      </div>
    </div>
  );
};

export default Tooltip;
