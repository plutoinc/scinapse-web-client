import React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { FILTER_BUTTON_COLOR_EXPERIMENT } from '../../constants/abTestGlobalValue';
const s = require('./filterButton.scss');

export enum FILTER_BUTTON_TYPE {
  YEAR = 'YEAR',
  JOURNAL = 'JOURNAL',
  FOS = 'FOS',
  SORTING = 'SORTING',
}

export interface FilterButtonProps {
  content: string;
  isActive: boolean;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const FilterButton: React.FC<FilterButtonProps> = ({ content, onClick, isActive, selected }) => {
  const [applyButtonColor, setApplyButtonColor] = React.useState(false);

  React.useEffect(() => {
    const doChangeButtonColor = getUserGroupName(FILTER_BUTTON_COLOR_EXPERIMENT) === 'gray30';
    setApplyButtonColor(doChangeButtonColor);
  }, []);

  return (
    <button
      className={classNames({
        [s.filterBtn]: !isActive && !applyButtonColor,
        [s.grayFilterBtn]: !isActive && applyButtonColor,
        [s.active]: isActive,
        [s.selected]: selected,
      })}
      onClick={onClick}
    >
      {content}
      <Icon
        icon="ARROW_POINT_TO_DOWN"
        className={classNames({
          [s.arrowIcon]: true,
          [s.activeIcon]: isActive,
          [s.selected]: selected,
        })}
      />
    </button>
  );
};

export default withStyles<typeof FilterButton>(s)(FilterButton);
