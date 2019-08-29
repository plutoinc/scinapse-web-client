import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./moreDropdownItem.scss');

// export const SuggestChangeButton: React.FC<{paperId: number}> = ({ paperId }) => {
//   useStyles(s);
//   return (
//     <MenuItem
//       classes={{ root: s.moreButtonItem }}
//       onClick={() => {
//         window.open(
//           // tslint:disable-next-line:max-line-length
//           `https://docs.google.com/forms/d/e/1FAIpQLScS76iC1pNdq94mMlxSGjcp_BuBM4WqlTpfPDt19LgVJ-t7Ng/viewform?usp=pp_url&entry.130188959=${paperId}&entry.1298741478`,
//           '_blank'
//         );
//       }}
//     >
//       Suggest change
//     </MenuItem>
//   );
// };

const PaperItemMoreDropdownItem: React.FC<{ onClick: () => void; content: string }> = ({ onClick, content }) => {
  useStyles(s);
  return (
    <MenuItem classes={{ root: s.moreButtonItem }} onClick={onClick}>
      {content}
    </MenuItem>
  );
};

export default PaperItemMoreDropdownItem;
