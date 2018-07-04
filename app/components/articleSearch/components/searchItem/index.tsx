import * as React from "react";
import InfoList from "./infoList";
import PublishInfoList from "./publishInfoList";
import Abstract from "./abstract";
import Title from "./title";
import { Paper } from "../../../../model/paper";
import { CurrentUser } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./searchItem.scss");

export interface SearchItemProps {
  paper: Paper;
  searchQueryText: string;
  isBookmarked: boolean;
  currentUser: CurrentUser;
  toggleAddCollectionDialog: (paperId: number) => void;
  toggleCitationDialog: () => void;
  handlePostBookmark: (paper: Paper) => void;
  handleRemoveBookmark: (paper: Paper) => void;
  setActiveCitationDialog?: (paperId: number) => void;
}

class SearchItem extends React.PureComponent<SearchItemProps> {
  public constructor(props: SearchItemProps) {
    super(props);
  }

  public render() {
    const {
      searchQueryText,
      currentUser,
      paper,
      toggleCitationDialog,
      setActiveCitationDialog,
      handlePostBookmark,
      isBookmarked,
      handleRemoveBookmark,
      toggleAddCollectionDialog
    } = this.props;
    const { title, venue, authors, year, doi, abstract, urls, journal } = paper;

    let source: string;
    if (!!doi) {
      source = `https://doi.org/${doi}`;
    } else if (urls && urls.length > 0) {
      source = urls[0].url;
    } else {
      source = "";
    }

    return (
      <div className={styles.searchItemWrapper}>
        <div className={styles.contentSection}>
          <Title
            title={title}
            paperId={paper.id}
            searchQueryText={searchQueryText}
            source={source}
          />
          <PublishInfoList
            journalName={journal ? journal.fullTitle! : venue}
            journalIF={journal ? journal.impactFactor || 0 : 0}
            year={year}
            authors={authors}
          />
          <Abstract abstract={abstract} searchQueryText={searchQueryText} />
          <InfoList
            toggleAddCollectionDialog={toggleAddCollectionDialog}
            handleRemoveBookmark={handleRemoveBookmark}
            handlePostBookmark={handlePostBookmark}
            currentUser={currentUser}
            isBookmarked={isBookmarked}
            setActiveCitationDialog={setActiveCitationDialog}
            toggleCitationDialog={toggleCitationDialog}
            paper={paper}
          />
        </div>
      </div>
    );
  }
}

export default withStyles<typeof SearchItem>(styles)(SearchItem);
