import * as React from "react";
import { CurrentUser } from "../../../model/currentUser";
import Abstract from "./abstract";
import PaperActionButtons from "./paperActionButtons";
import Title from "./title";
import JournalAndAuthors from "./journalAndAuthors";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
const styles = require("./paperItem.scss");

export interface PaperItemProps {
  paper: Paper;
  refererSection: string;
  paperNote?: string;
  searchQueryText?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  currentUser?: CurrentUser;
  omitAbstract?: boolean;
  omitButtons?: boolean;
  hasRemoveButton?: boolean;
  handleRemovePaper?: (paper: Paper) => void;
}

class RawPaperItem extends React.PureComponent<PaperItemProps> {
  public render() {
    const {
      searchQueryText,
      paper,
      wrapperClassName,
      currentUser,
      wrapperStyle,
      refererSection,
      omitAbstract,
      omitButtons,
      hasRemoveButton,
      handleRemovePaper,
    } = this.props;
    const { title, authors, year, doi, urls, journal } = paper;

    const abstract = !omitAbstract ? <Abstract abstract={paper.abstract} searchQueryText={searchQueryText} /> : null;
    const buttons =
      !omitButtons && currentUser ? (
        <PaperActionButtons
          currentUser={currentUser}
          paper={paper}
          hasRemoveButton={hasRemoveButton}
          handleRemovePaper={handleRemovePaper}
        />
      ) : null;

    let source: string;
    if (!!doi) {
      source = `https://doi.org/${doi}`;
    } else if (urls && urls.length > 0) {
      source = urls[0].url;
    } else {
      source = "";
    }

    return (
      <div style={wrapperStyle} className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}>
        <div className={styles.contentSection}>
          <Title
            refererSection={refererSection}
            title={title}
            paperId={paper.id}
            searchQueryText={searchQueryText}
            source={source}
          />
          <JournalAndAuthors journal={journal} year={year} authors={authors} />
          {abstract}
          {buttons}
        </div>
      </div>
    );
  }
}

export default withStyles<typeof RawPaperItem>(styles)(RawPaperItem);
