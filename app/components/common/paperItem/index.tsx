import * as React from "react";
import InfoList from "./infoList";
import PublishInfoList from "./publishInfoList";
import Abstract from "./abstract";
import Title from "./title";
import { Paper } from "../../../model/paper";
import { CurrentUser } from "../../../model/currentUser";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./paperItem.scss");

export interface PaperItemProps {
  paper: Paper;
  currentUser: CurrentUser;
  searchQueryText?: string;
  openAddCollectionDialog: (paperId: number) => void;
}

class PaperItem extends React.PureComponent<PaperItemProps> {
  public constructor(props: PaperItemProps) {
    super(props);
  }

  public render() {
    const { searchQueryText, currentUser, paper, openAddCollectionDialog } = this.props;
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
          <Title title={title} paperId={paper.id} searchQueryText={searchQueryText} source={source} />
          <PublishInfoList
            journalName={journal ? journal.fullTitle! : venue}
            journalIF={journal ? journal.impactFactor || 0 : 0}
            year={year}
            authors={authors}
          />
          <Abstract abstract={abstract} searchQueryText={searchQueryText} />
          <InfoList openAddCollectionDialog={openAddCollectionDialog} currentUser={currentUser} paper={paper} />
        </div>
      </div>
    );
  }
}

export default withStyles<typeof PaperItem>(styles)(PaperItem);
