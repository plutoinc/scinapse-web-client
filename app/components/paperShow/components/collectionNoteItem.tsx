import * as React from "react";
import * as classNames from "classnames";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Collection } from "../../../model/collection";
import PaperNoteForm from "../noteForm";
import Icon from "../../../icons";
const styles = require("./collectionNoteList.scss");

interface CollectionNoteItemProps {
  collection: Collection;
  handleAnimationEnd: (collection: Collection) => void;
  onSubmitNote: (note: string, collection: Collection) => Promise<void>;
  onDeleteNote: (collection: Collection) => void;
}

interface CollectionNoteItemState {
  isLoading: boolean;
  isEdit: boolean;
}

@withStyles<typeof CollectionNoteItem>(styles)
class CollectionNoteItem extends React.PureComponent<CollectionNoteItemProps, CollectionNoteItemState> {
  private noteItemNode: HTMLLIElement | null;

  public constructor(props: CollectionNoteItemProps) {
    super(props);

    this.state = {
      isLoading: false,
      isEdit: false,
    };
  }

  public componentDidMount() {
    if (this.noteItemNode) {
      this.noteItemNode.addEventListener("animationend", this.handleAnimationEnd, { passive: true });
    }
  }

  public componentWillUnmount() {
    if (this.noteItemNode) {
      this.noteItemNode.removeEventListener("animationend", this.handleAnimationEnd);
    }
  }

  public render() {
    const { collection } = this.props;
    const { isEdit, isLoading } = this.state;

    let content;
    if (!isEdit && collection.note) {
      content = (
        <>
          <div className={styles.memoContent}>{collection.note}</div>
          <div className={styles.noteButtonWrapper}>
            <span className={styles.noteControlIconWrapper} onClick={this.toggleNoteEditMode}>
              <Icon icon="PEN" className={`${styles.noteControlIcon} ${styles.penIcon}`} />
            </span>
            <span className={styles.noteControlIconWrapper} onClick={this.handleDeleteNote}>
              <Icon icon="TRASH_CAN" className={`${styles.noteControlIcon} ${styles.trashIcon}`} />
            </span>
          </div>
          <div className={styles.memoCollectionName}>
            - Saved to{" "}
            <Link className={styles.name} to={`/collections/${collection.id}`}>
              {collection.title}
            </Link>
          </div>
        </>
      );
    } else if (isEdit && collection.note) {
      content = (
        <PaperNoteForm
          row={2}
          isLoading={isLoading}
          onSubmit={this.handleSubmitNote}
          isEdit={isEdit}
          autoFocus={true}
          textareaStyle={{
            border: 0,
            padding: 0,
            borderRadius: "8px",
            fontSize: "14px",
            width: "100%",
            maxHeight: "105px",
          }}
          onClickCancel={this.toggleNoteEditMode}
          initialValue={collection.note}
        />
      );
    }

    return (
      <li
        ref={el => (this.noteItemNode = el)}
        className={classNames({
          [styles.memoItem]: true,
          [styles.updatedMemoItem]: collection.noteUpdated,
        })}
      >
        {content}
      </li>
    );
  }

  private toggleNoteEditMode = () => {
    this.setState(prevState => ({ ...prevState, isEdit: !prevState.isEdit }));
  };

  private handleDeleteNote = async () => {
    const { onDeleteNote, collection } = this.props;

    this.setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      onDeleteNote(collection);
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  private handleSubmitNote = async (note: string) => {
    const { onSubmitNote, collection } = this.props;

    this.setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      await onSubmitNote(note, collection);
      if (note) {
        this.setState(prevState => ({ ...prevState, isEdit: false, isLoading: false }));
      }
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  private handleAnimationEnd = () => {
    const { handleAnimationEnd, collection } = this.props;

    handleAnimationEnd(collection);
  };
}

export default CollectionNoteItem;
