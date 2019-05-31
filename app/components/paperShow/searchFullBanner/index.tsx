import * as React from 'react';
import SearchQueryInput from '../../common/InputWithSuggestionList/searchQueryInput';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
const s = require('./searchFullBanner.scss');

interface SearchFullScrollBannerProps {
  isOpen: boolean;
  onClickCloseBtn: () => void;
}

const SearchFullScrollBanner: React.FC<SearchFullScrollBannerProps> = ({ isOpen, onClickCloseBtn }) => {
  const [isFullWindow, setIsFullWindow] = React.useState(false);
  let containerMaxHeight = '0px';
  if (isOpen && !isFullWindow) {
    containerMaxHeight = '33vh';
  } else if (isOpen && isFullWindow) {
    containerMaxHeight = '100%';
  }

  return (
    <div className={s.wrapper} style={{ maxHeight: containerMaxHeight }}>
      <div className={s.closeButton} onClick={onClickCloseBtn}>
        <Icon className={s.closeIcon} icon="X_BUTTON" />
      </div>
      <div className={s.contentContainer}>
        <div className={s.titleText}>Are you a researcher?</div>
        <div className={s.subText}>
          Try search on the <span className={s.blueStrong}>fastest</span> academic search engine.
        </div>
        <div className={s.searchBarContainer}>
          <SearchQueryInput
            wrapperClassName={s.inputWrapper}
            inputClassName={s.input}
            actionArea="searchFullBanner"
            maxCount={3}
            autoFocus={false}
            onFocus={() => {
              setIsFullWindow(true);
            }}
          />
          <button type="button" className={s.searchBtn}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof SearchFullScrollBanner>(s)(SearchFullScrollBanner);
