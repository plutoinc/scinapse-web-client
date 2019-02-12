import * as React from "react";
import { Dispatch, connect } from "react-redux";
import PaperItem, { PaperItemProps } from "../common/paperItem";
import { withStyles } from "../../helpers/withStylesHelper";
import PaperNoteForm, { PaperNoteFormProps } from "../paperShow/noteForm";
import { updatePaperNote } from "../../actions/collection";
const styles = require("./collectionPaperItem.scss");

// tslint:disable-next-line:no-empty-interface
export interface CollectionPaperItemProps extends PaperItemProps {
  collectionId: number;
  dispatch: Dispatch<any>;
}

interface NoteSectionProps extends PaperNoteFormProps {
  paperId: number;
  note?: string;
}

const NoteSection: React.SFC<NoteSectionProps> = ({ note, isLoading, onSubmit }) => {
  if (note) {
    return (
      <div className={styles.memo}>
        <div className={styles.memo_item}>{note}</div>
      </div>
    );
  }

  return (
    <div className={styles.memo}>
      <PaperNoteForm isLoading={isLoading} onSubmit={onSubmit} />
    </div>
  );
};

class CollectionPaperItem extends React.PureComponent<CollectionPaperItemProps> {
  public render() {
    const { paper, paperNote } = this.props;

    const paperItemProps = {
      ...this.props,
      wrapperStyle: {
        borderBottom: "none",
        marginBottom: "0",
        paddingBottom: "0",
      },
    };

    return (
      <div className={styles.CollectionPaperItemWrapper}>
        <div className={styles.paper}>
          <PaperItem {...paperItemProps} />
        </div>
        <NoteSection note={paperNote} paperId={paper.id} isLoading={false} onSubmit={this.handleSubmitNote} />
      </div>
    );
  }

  private handleSubmitNote = (note: string) => {
    const { dispatch, paper, collectionId } = this.props;

    dispatch(
      updatePaperNote({
        paperId: paper.id,
        collectionId,
        note,
      })
    );
  };
}

export default connect()(withStyles<typeof CollectionPaperItem>(styles)(CollectionPaperItem));
