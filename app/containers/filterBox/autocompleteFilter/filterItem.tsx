import * as React from 'react';
import { Link } from 'react-router-dom';
import * as classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '../../../helpers/withStylesHelper';
const s = require('./autocompleteFilter.scss');

interface FilterItemProps {
  content: string;
  checked: boolean;
  to: string;
  isHighlight: boolean;
}

const FilterItem: React.FunctionComponent<FilterItemProps> = props => {
  return (
    <Link
      to={props.to}
      className={classNames({
        [s.listItem]: true,
        [s.highlighted]: props.isHighlight,
      })}
    >
      <Checkbox
        classes={{
          root: s.checkboxIcon,
          checked: s.checkedCheckboxIcon,
        }}
        checked={props.checked}
      />
      <span className={s.itemContent}>{props.content}</span>
    </Link>
  );
};

export default withStyles<typeof FilterItem>(s)(FilterItem);
