import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Filter } from "../../../api/member";
import Icon from "../../../icons";
const styles = require("./savedFilterItem.scss");

interface SavedFilterItemProps {
  searchInput: string;
  sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
  savedFilter: Filter;
  handleClickItem: (query: string, sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS, filter: Filter) => void;
  handleDeleteItem: () => void;
}

const SavedFilterItem: React.FunctionComponent<SavedFilterItemProps> = props => {
  const { searchInput, sort, handleClickItem, savedFilter, handleDeleteItem } = props;

  return (
    <li onClick={() => handleClickItem(searchInput, sort, savedFilter)} className={styles.filterItemWrapper}>
      <div className={styles.filterItem}>
        <Icon icon="FILTER_RESULT_BUTTON" className={styles.filterItemIcon} />
        <span className={styles.filterItemTitle}>{savedFilter.name}</span>
        <span className={styles.deleteIconWrapper} onClick={() => handleDeleteItem()}>
          <Icon icon="TRASH_CAN" className={styles.trashIcon} />
        </span>
      </div>
    </li>
  );
};

export default withStyles<typeof SavedFilterItem>(styles)(SavedFilterItem);
