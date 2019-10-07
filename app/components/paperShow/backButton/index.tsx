import * as React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AppState } from '../../../reducers';
import Icon from '../../../icons';

const useStyles = require('isomorphic-style-loader/useStyles');
const styles = require('./backButton.scss');

type GoBackResultBtnProps = RouteComponentProps<any> & {
  className?: string;
};

const GoBackResultBtn: React.SFC<GoBackResultBtnProps> = props => {
  useStyles(styles);
  const { history, className } = props;
  const searchInput = useSelector((state: AppState) => state.articleSearch.searchInput);

  if (!searchInput) return null;

  return (
    <div
      className={classNames({
        [styles.goBackBtn]: true,
        [className!]: !!className,
      })}
      onClick={() => {
        history.goBack();
      }}
    >
      <Icon icon="BACK" className={styles.backIcon} />
      <span>BACK TO PREVIOUS</span>
    </div>
  );
};

export default withRouter(GoBackResultBtn);
