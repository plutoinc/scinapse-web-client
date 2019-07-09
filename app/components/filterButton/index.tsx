import React from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
const s = require('./filterButton.scss');

export enum FILTER_BUTTON_TYPE {
  YEAR,
  JOURNAL,
  FOS,
  SORTING,
}

export interface FilterButtonProps {
  content: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const FilterButton: React.FC<FilterButtonProps> = ({ content, onClick }) => {
  return <button onClick={onClick}>{content}</button>;
};

export default withStyles<typeof FilterButton>(s)(FilterButton);
