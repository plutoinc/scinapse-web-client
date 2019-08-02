import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import classNames from 'classnames';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';
import formatNumber from '../../helpers/formatNumber';

const s = require('./journalFilterItem.scss');

interface JournalItemProps {
  title: string;
  checked: boolean;
  isHighlight: boolean;
  onClick: () => void;
  isSearchResult?: boolean;
  docCount?: number;
  IF?: number;
  fromSearch?: boolean;
}

const JournalItem: React.FC<JournalItemProps> = props => {
  let ImpactFactor = null;
  if (props.IF) {
    ImpactFactor = (
      <span
        className={classNames({
          [s.ifLabel]: true,
          [s.noDocCount]: props.isSearchResult,
        })}
      >
        <Tooltip
          disableFocusListener={true}
          disableTouchListener={true}
          title="Impact Factor"
          placement="top"
          classes={{ tooltip: s.arrowBottomTooltip }}
        >
          <span>
            <Icon className={s.ifIconWrapper} icon="IMPACT_FACTOR" />
            {props.IF.toFixed(2)}
          </span>
        </Tooltip>
      </span>
    );
  }

  let docCount = null;
  if (!props.isSearchResult && !props.fromSearch) {
    docCount = <span className={s.countBox}>{`(${formatNumber(props.docCount)})`}</span>;
  }

  return (
    <button
      onClick={() => {
        props.onClick();
      }}
      className={classNames({
        [s.journalItem]: true,
        [s.searchResult]: props.isSearchResult,
        [s.isSelected]: props.checked,
        [s.highlighted]: props.isHighlight,
      })}
    >
      <input type="checkbox" className={s.checkbox} checked={props.checked} readOnly />
      <span className={s.title}>{props.title}</span>
      {ImpactFactor}
      {docCount}
    </button>
  );
};

export default withStyles<typeof JournalItem>(s)(JournalItem);
