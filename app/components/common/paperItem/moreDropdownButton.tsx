import React from 'react';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PaperItemMoreDropdownItem from './moreDropdownItem';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';
import { Button } from '@pluto_network/pluto-design-elements';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./moreDropdownButton.scss');

interface MoreDropdownButtonProps {
  paper: Paper;
  dropdownContents?: React.ReactElement[];
}

const MoreDropdownButton: React.FC<MoreDropdownButtonProps> = ({ dropdownContents = [], paper }) => {
  useStyles(s);
  const buttonAnchor = React.useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const defaultDropdownContent = (
    <PaperItemMoreDropdownItem
      key={0}
      content="Suggest change"
      onClick={() => {
        window.open(
          // tslint:disable-next-line:max-line-length
          `https://docs.google.com/forms/d/e/1FAIpQLScS76iC1pNdq94mMlxSGjcp_BuBM4WqlTpfPDt19LgVJ-t7Ng/viewform?usp=pp_url&entry.130188959=${
            paper.id
          }&entry.1298741478`,
          '_blank'
        );
      }}
    />
  );

  const contents = [...dropdownContents, defaultDropdownContent].map((comp, i) => (
    <div onClick={() => setIsOpen(false)} key={i}>
      {comp}
    </div>
  ));

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className={s.moreButton}>
        <div ref={buttonAnchor}>
          <Button elementType="button" size="small" variant="outlined" color="gray" onClick={() => setIsOpen(!isOpen)}>
            <Icon icon="ELLIPSIS" />
          </Button>
        </div>
        <Popper
          className={s.moreDropdown}
          anchorEl={buttonAnchor.current}
          placement="bottom-end"
          open={isOpen}
          disablePortal
        >
          <div className={s.contentWrapper}>{contents}</div>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default MoreDropdownButton;
