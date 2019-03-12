import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { FilterObject } from "../../../helpers/papersQueryFormatter";
import Popper from "@material-ui/core/Popper";
const styles = require("./filterSaveBox.scss");

interface FilterSaveBoxProps {
  makeNewFilterLink: (newFilter: FilterObject) => string;
}

const FilterSaveBox: React.FunctionComponent<FilterSaveBoxProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  let popoverAnchorEl: HTMLDivElement | null;
  return (
    <div ref={el => (popoverAnchorEl = el)}>
      <div
        className={classNames({
          [styles.filterContainerTitleBox]: true,
          [styles.openFilterContainerTitleBox]: isOpen,
        })}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className={styles.filterTitleBox}>
          <Icon className={styles.filterResultButton} icon="FILTER_RESULT_BUTTON" />
          <span className={styles.filterContainerTitle}>PAPER FILTERS</span>
          <Icon
            className={classNames({
              [styles.downArrow]: !isOpen,
              [styles.upArrow]: isOpen,
            })}
            icon="ARROW_POINT_TO_UP"
          />
        </div>
      </div>
      <Popper
        open={isOpen}
        anchorEl={popoverAnchorEl!}
        placement="bottom-end"
        disablePortal={true}
        modifiers={{
          flip: {
            enabled: false,
          },
        }}
        style={{
          width: "100%",
          position: "absolute",
          backgroundColor: "white",
          zIndex: 99,
        }}
      >
        <ul className={styles.popperWrapper}>
          <li className={styles.filterItemWrapper}>
            <div className={styles.defaultFilterItem}>
              <Icon icon="DEFAULT" className={styles.defaultFilterItemIcon} />
              <span className={styles.defaultFilterItemTitle}>All Result (Default)</span>
            </div>
          </li>
          <li className={styles.filterItemWrapper}>
            <div className={styles.filterItem}>
              <Icon icon="FILTER_RESULT_BUTTON" className={styles.filterItemIcon} />
              <span className={styles.filterItemTitle}>All Result (Default)</span>
            </div>
          </li>
        </ul>
      </Popper>
    </div>
  );
};

export default withStyles<typeof FilterSaveBox>(styles)(FilterSaveBox);
