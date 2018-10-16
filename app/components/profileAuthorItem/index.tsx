import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import { Author } from "../../model/author/author";
import Icon from "../../icons";
import Checkbox from "@material-ui/core/Checkbox";
const styles = require("./profileAuthorItem.scss");

interface ProfileAuthorItemProps {
  author: Author;
  isSelected: boolean;
  handleToggleAuthor: (isAlreadySelected: boolean, author: Author) => void;
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
    const { author, isSelected } = this.props;

    const moreIcon =
      author.top_papers && author.top_papers.length > 2 ? (
        <div onClick={this.handleToggleMoreIcon} className={styles.moreIconWrapper}>
          <Icon icon="ELLIPSIS" className={styles.moreIcon} />
        </div>
      ) : null;

    return (
      <div className={styles.itemWrapper}>
        <div className={styles.selectBox}>
          <Checkbox
            classes={{
              root: styles.checkBox,
              checked: styles.checkedCheckboxIcon,
            }}
            onClick={this.handleToggleCheckbox}
            checked={isSelected}
            value={author.name}
            color="primary"
          />
        </div>
        <div className={styles.authorWrapper}>
          <div className={styles.header}>
            <div className={styles.authorName}>{author.name}</div>
            <div className={styles.affiliation}>
              {author.lastKnownAffiliation ? author.lastKnownAffiliation.name : ""}
            </div>
          </div>
          <div className={styles.content}>
            {this.getMappedPapers()}
            {moreIcon}
          </div>
        </div>
      </div>
    );
  }

  private handleToggleCheckbox = () => {
    const { handleToggleAuthor, isSelected, author } = this.props;

    handleToggleAuthor(isSelected, author);
  };

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

  private handleToggleMoreIcon = () => {
    const { isOpen } = this.state;

    this.setState(prevState => ({ ...prevState, isOpen: !isOpen }));
  };
}

export default ProfileAuthorItem;
