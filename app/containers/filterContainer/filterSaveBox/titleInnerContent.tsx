import * as React from "react";
import * as classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ArticleSearchState } from "../../../components/articleSearch/records";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./filterSaveBox.scss");

interface FilterTitleInnerContnetProps {
  articleSearchState: ArticleSearchState;
  hasFilterChanged: boolean;
  hasOpenEmojiPicker: boolean;
  hasOpenTitleInput: boolean;
  onClickDropDownOpen: (value: React.SetStateAction<boolean>) => void;
  onClickSetIsOpenEmojiPicker: (value: React.SetStateAction<boolean>) => void;
  onClickSetIsTitleInput: (value: React.SetStateAction<boolean>) => void;
}

const FilterTitleInnerContent: React.FunctionComponent<FilterTitleInnerContnetProps> = props => {
  const {
    articleSearchState,
    hasFilterChanged,
    hasOpenEmojiPicker,
    hasOpenTitleInput,
    onClickDropDownOpen,
    onClickSetIsOpenEmojiPicker,
    onClickSetIsTitleInput,
  } = props;
  const { currentSavedFilter, isFilterSaveBoxLoading } = articleSearchState;
  if (!currentSavedFilter) {
    return (
      <>
        {isFilterSaveBoxLoading ? (
          <div className={styles.buttonSpinnerWrapper}>
            <CircularProgress size={14} thickness={4} color="inherit" className={styles.buttonSpinner} />
          </div>
        ) : (
          <Icon className={styles.filterResultButton} icon="FILTER_RESULT_BUTTON" />
        )}
        <span
          className={classNames({
            [styles.filterContainerDefaultTitle]: !isFilterSaveBoxLoading,
            [styles.loadingFilterContainerTitle]: isFilterSaveBoxLoading,
          })}
        >
          PAPER FILTERS
        </span>
      </>
    );
  } else {
    return (
      <div className={styles.titleContentWrapper}>
        {isFilterSaveBoxLoading ? (
          <div className={styles.buttonSpinnerWrapper}>
            <CircularProgress size={14} thickness={4} color="inherit" className={styles.buttonSpinner} />
          </div>
        ) : (
          <span
            className={styles.filterContainerEmoji}
            onClick={e => {
              e.stopPropagation();
              onClickDropDownOpen(false);
              onClickSetIsOpenEmojiPicker(!hasOpenEmojiPicker);
            }}
          >
            {currentSavedFilter.emoji}
          </span>
        )}
        <span
          className={classNames({
            [styles.filterContainerTitle]: !isFilterSaveBoxLoading,
            [styles.loadingFilterContainerTitle]: isFilterSaveBoxLoading,
          })}
        >
          {currentSavedFilter.name}
        </span>
        {hasFilterChanged ? null : (
          <span
            onClick={e => {
              e.stopPropagation();
              onClickSetIsTitleInput(!hasOpenTitleInput);
            }}
            className={styles.titleControlIconWrapper}
          >
            <Icon icon="PEN" className={styles.titleControlIcon} />
          </span>
        )}
      </div>
    );
  }
};

export default withStyles<typeof FilterTitleInnerContent>(styles)(FilterTitleInnerContent);
