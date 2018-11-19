import * as React from "react";
import Authors, { AuthorsProps } from "./authors";
import PaperItemJournal from "./journal";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { Journal } from "../../../model/journal";
const styles = require("./publishInfoList.scss");

export interface PublishInfoListProps extends Readonly<AuthorsProps> {
  journal: Journal | null;
  year: number | null;
}

class PublishInfoList extends React.PureComponent<PublishInfoListProps, {}> {
  public render() {
    const { authors, journal, year } = this.props;

    return (
      <div className={styles.publishInfoList}>
        <PaperItemJournal journal={journal} year={year} />
        {authors ? (
          <div className={styles.author}>
            <Icon icon="AUTHOR" />
            <Authors authors={authors} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles<typeof PublishInfoList>(styles)(PublishInfoList);
