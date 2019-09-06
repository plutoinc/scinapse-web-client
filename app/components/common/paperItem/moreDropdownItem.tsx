import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./moreDropdownItem.scss');

const PaperItemMoreDropdownItem: React.FC<{ onClick: () => void; content: string }> = ({ onClick, content }) => {
  useStyles(s);
  return (
    <MenuItem classes={{ root: s.moreButtonItem }} onClick={onClick}>
      {content}
    </MenuItem>
  );
};

export default PaperItemMoreDropdownItem;
