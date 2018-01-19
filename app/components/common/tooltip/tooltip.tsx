import * as React from "react";
import Icon from "../../../icons";

const styles = require("./tooltip.scss");

interface ITooltipProps {
  left: number;
  top: number;
  iconTop: number;
  className: string;
  content: string;
  type: TOOLTIP_TYPE;
}

export type TOOLTIP_TYPE = "h-index";

const Tooltip = (props: ITooltipProps) => {
  const { left, top, iconTop, className, content, type } = props;
  let containerClassName = styles.tooltipContainer;
  if (className) {
    containerClassName = `${styles.tooltipContainer} ${className}`;
  }
  let iconName;
  switch (type) {
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
        left,
        top,
      }}
    >
      <div className={styles.innerContainer}>
        <div
          className={styles.tooltipIconWrapper}
          style={{
            top: iconTop,
          }}
        >
          <Icon icon={iconName} />
        </div>
        <div className={styles.tooltipContent}>{content}</div>
      </div>
    </div>
  );
};

export default Tooltip;
