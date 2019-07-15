import React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
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
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const FilterButton: React.FC<FilterButtonProps> = ({ content, onClick, isActive }) => {
  return (
    <button
      className={classNames({
        [s.filterBtn]: !isActive,
        [s.active]: isActive,
      })}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default withStyles<typeof FilterButton>(s)(FilterButton);
