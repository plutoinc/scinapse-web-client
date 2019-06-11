import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AppState } from '../../../reducers';
import PapersQueryFormatter from '../../../helpers/searchQueryManager';
import { ArticleSearchState } from '../../articleSearch/records';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./backButton.scss');

export interface GoBackResultBtnProps extends RouteComponentProps<any> {
  articleSearch: ArticleSearchState;
}

const GoBackResultBtn: React.SFC<GoBackResultBtnProps> = props => {
  const { articleSearch, history } = props;

  if (articleSearch.searchInput && articleSearch.searchInput.length > 0) {
    return (
      <div
        className={styles.goBackBtn}
        onClick={() => {
          history.push({
            pathname: '/search',
            search: PapersQueryFormatter.stringifyPapersQuery({
              query: articleSearch.searchInput,
              page: 1,
              sort: 'RELEVANCE',
              filter: PapersQueryFormatter.objectifyPaperFilter(),
            }),
          });
        }}
      >
        <Icon icon="BACK" className={styles.backIcon} /> BACK TO RESULTS
      </div>
    );
  }

  return null;
};

function mapStateToProps(state: AppState) {
  return {
    articleSearch: state.articleSearch,
  };
}

export default connect(mapStateToProps)(withRouter(withStyles<typeof GoBackResultBtn>(styles)(GoBackResultBtn)));
