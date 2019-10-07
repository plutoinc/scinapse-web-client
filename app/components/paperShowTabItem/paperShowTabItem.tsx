import React, { FC } from 'react';
import classNames from 'classnames';

const s = require('./paperShowTabItem.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

export const enum AvailablePaperShowTab {
  ref,
  cited,
  related,
}

interface Props {
  type: AvailablePaperShowTab;
  onClick: (target: AvailablePaperShowTab) => void;
  content: string;
  active: boolean;
  className?: string;
}

const PaperShowTabItem: FC<Props> = ({ onClick, type, content, className, active }) => {
  useStyles(s);
  return (
    <span
      onClick={() => onClick(type)}
      className={classNames({
        [s.tabItem]: true,
        [s.active]: active,
        [className!]: !!className,
      })}
    >
      {content}
    </span>
  );
};
export default PaperShowTabItem;
