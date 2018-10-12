import * as React from "react";
import { CurrentUser } from "../../model/currentUser";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseButton from "../common/scinapseButton";
import ScinapseInput from "../common/scinapseInput";
import ProfileAPI from "../../api/profile";
import { Author } from "../../model/author/author";
const styles = require("./profileSelectPaperList.scss");

interface ProfileSelectPaperListProps {
  currentUser: CurrentUser;
}

interface ProfileSelectPaperListState {
  papers: Author[];
}

@withStyles<typeof ProfileSelectPaperList>(styles)
class ProfileSelectPaperList extends React.PureComponent<ProfileSelectPaperListProps, ProfileSelectPaperListState> {
  public constructor(props: ProfileSelectPaperListProps) {
    super(props);

    this.state = {
      papers: [],
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
      </div>
    );
  }

  private handleSubmitSearch = async (query: string) => {
    const res = await ProfileAPI.getPapersFromAuthor(query);
    console.log(res);
  };

  private handleClickConfirmBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
}

export default ProfileSelectPaperList;
