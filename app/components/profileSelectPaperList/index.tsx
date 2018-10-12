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
}

interface ProfileSelectPaperListState {
  isLoading: boolean;
  authors: Author[];
}

@withStyles<typeof ProfileSelectPaperList>(styles)
class ProfileSelectPaperList extends React.PureComponent<ProfileSelectPaperListProps, ProfileSelectPaperListState> {
  public constructor(props: ProfileSelectPaperListProps) {
    super(props);

    this.state = {
      isLoading: false,
      authors: [],
    };
  }

  public componentDidMount() {
    const { currentUser } = this.props;

    const name = currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.firstName;
    ProfileAPI.getPapersFromAuthor(name);
  }

  public render() {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <div className={styles.description}>
            Please check all the authors you think you are. The papers will be displayed on your profile.
          </div>
          <ScinapseButton gaCategory="Profile Action" buttonText="CONFIRM" onClick={this.handleClickConfirmBtn} />
        </div>
        <div className={styles.searchWrapper}>
          <ScinapseInput
            placeholder="Search papers"
            icon="SEARCH_ICON"
            inputStyle={{
              border: 0,
              borderRadius: 0,
              borderBottom: "2px solid #d9dee7",
            }}
            onSubmit={this.handleSubmitSearch}
          />
        </div>
        {this.getAuthorList()}
      </div>
    );
  }

  private getAuthorList = () => {
    const { isLoading, authors } = this.state;

    if (isLoading) {
      return (
        <div className={styles.spinnerWrapper}>
          <ArticleSpinner />
        </div>
      );
    } else if (!isLoading && authors.length === 0) {
      return <div>There is no matching author.</div>;
    }
    return authors.map(author => <ProfileAuthorItem key={author.id} author={author} />);
  };

  private handleSubmitSearch = async (query: string) => {
    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const res = await ProfileAPI.getPapersFromAuthor(query);

      this.setState(prevState => ({ ...prevState, authors: res.data.content, isLoading: false }));
    } catch (err) {
      // TODO: Remove below console
      console.error(err);
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  private handleClickConfirmBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
}

export default ProfileSelectPaperList;
