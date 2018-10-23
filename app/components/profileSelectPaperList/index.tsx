import * as React from "react";
import { CurrentUser } from "../../model/currentUser";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseButton from "../common/scinapseButton";
import ScinapseInput from "../common/scinapseInput";
import ProfileAPI from "../../api/profile";
import { Author } from "../../model/author/author";
import ArticleSpinner from "../common/spinner/articleSpinner";
import ProfileAuthorItem from "../profileAuthorItem";
const styles = require("./profileSelectPaperList.scss");

interface ProfileSelectPaperListProps {
  currentUser: CurrentUser;
  handleClickConfirm: (authorIds: number[]) => Promise<void>;
}

interface ProfileSelectPaperListState {
  isLoading: boolean;
  authors: Author[];
  selectedAuthors: Author[];
  authorName: string;
}

@withStyles<typeof ProfileSelectPaperList>(styles)
class ProfileSelectPaperList extends React.PureComponent<ProfileSelectPaperListProps, ProfileSelectPaperListState> {
  public constructor(props: ProfileSelectPaperListProps) {
    super(props);

    const { currentUser } = props;
    const name = currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.firstName;

    this.state = {
      isLoading: false,
      authors: [],
      selectedAuthors: [],
      authorName: name,
    };
  }

  public componentDidMount() {
    const { authorName } = this.state;

    ProfileAPI.getPapersFromAuthor(authorName);
  }

  public render() {
    const { authorName } = this.state;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <div className={styles.description}>
            Please check all the authors you think you are. <br />
            The papers will be displayed on your profile.
          </div>
          <ScinapseButton
            style={{
              backgroundColor: "#48d2a0",
              height: 36,
              width: 102,
            }}
            gaCategory="Profile Action"
            content="CONFIRM"
            onClick={this.handleClickConfirmBtn}
          />
        </div>
        <div className={styles.searchWrapper}>
          <ScinapseInput
            placeholder="Search authors by name"
            icon="SEARCH_ICON"
            inputStyle={{
              border: 0,
              borderRadius: 0,
              borderBottom: "2px solid #d9dee7",
            }}
            value={authorName}
            onChange={this.handleChangeInput}
            onSubmit={this.handleSubmitSearch}
          />
        </div>
        {this.getAuthorList()}
      </div>
    );
  }

  private handleChangeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, authorName: name }));
  };

  private handleToggleAuthor = (isAlreadySelected: boolean, author: Author) => {
    const { selectedAuthors } = this.state;

    if (isAlreadySelected) {
      const index = selectedAuthors.indexOf(author);
      const authorRemovedSelectedAuthors = [...selectedAuthors.slice(0, index), ...selectedAuthors.slice(index + 1)];
      this.setState(prevState => ({ ...prevState, selectedAuthors: authorRemovedSelectedAuthors }));
    } else {
      this.setState(prevState => ({ ...prevState, selectedAuthors: selectedAuthors.concat([author]) }));
    }
  };

  private getAuthorList = () => {
    const { isLoading, authors, selectedAuthors } = this.state;

    if (isLoading) {
      return (
        <div className={styles.spinnerWrapper}>
          <ArticleSpinner />
        </div>
      );
    } else if (!isLoading && authors.length === 0) {
      return <div className={styles.errorMessage}>There is no matching author :(</div>;
    }
    return authors.map(author => (
      <ProfileAuthorItem
        key={author.id}
        handleToggleAuthor={this.handleToggleAuthor}
        author={author}
        isSelected={selectedAuthors.includes(author)}
      />
    ));
  };

  private handleSubmitSearch = async () => {
    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const res = await ProfileAPI.getPapersFromAuthor(this.state.authorName);

      this.setState(prevState => ({ ...prevState, authors: res.data.content, isLoading: false }));
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  private handleClickConfirmBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { handleClickConfirm } = this.props;
    const { selectedAuthors } = this.state;

    e.preventDefault();

    if (selectedAuthors.length > 0) {
      handleClickConfirm(selectedAuthors.map(author => author.id));
    }
  };
}

export default ProfileSelectPaperList;
