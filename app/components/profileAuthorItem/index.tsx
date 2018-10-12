import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import { Author } from "../../model/author/author";
import Icon from "../../icons";
const styles = require("./profileAuthorItem.scss");

interface ProfileAuthorItemProps {
  author: Author;
}

interface ProfileAuthorItemState {
  isOpen: boolean;
}

@withStyles<typeof ProfileAuthorItem>(styles)
class ProfileAuthorItem extends React.PureComponent<ProfileAuthorItemProps, ProfileAuthorItemState> {
  public constructor(props: ProfileAuthorItemProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  public render() {
    const { author } = this.props;

    const moreIcon =
      author.top_papers && author.top_papers.length > 2 ? (
        <div className={styles.moreIconWrapper}>
          <Icon icon="ELLIPSIS" className={styles.moreIcon} />
        </div>
      ) : null;

    return (
      <div className={styles.authorItemWrapper}>
        <div className={styles.header}>
          <div className={styles.authorName}>{author.name}</div>
          <div className={styles.affiliation}>
            {author.lastKnownAffiliation ? author.lastKnownAffiliation.name : ""}
          </div>
          {this.getMappedPapers()}
          {moreIcon}
        </div>
      </div>
    );
  }

  private getMappedPapers = () => {
    const { author } = this.props;
    const { isOpen } = this.state;

    if (author.top_papers && author.top_papers.length > 0) {
      const papers = isOpen ? author.top_papers : author.top_papers.slice(0, 2);

      return papers.map(paper => {
        const authors = paper.authors.map(a => a.name).join(", ");
        const journalNode =
          paper.journal || paper.venue ? (
            <div className={styles.paperMetadata}>
              <Icon className={styles.metaIcon} icon="JOURNAL" />
              {paper.journal ? paper.journal.fullTitle : paper.venue || ""}
            </div>
          ) : null;

        return (
          <div className={styles.paperItemWrapper} key={paper.id}>
            <div className={styles.title}>{paper.title}</div>
            {journalNode}
            <div className={styles.paperMetadata}>
              <Icon className={styles.metaIcon} icon="AUTHOR" />
              {authors}
            </div>
          </div>
        );
      });
    }
    return null;
  };
}

export default ProfileAuthorItem;
