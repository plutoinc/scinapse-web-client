import * as React from "react";
import { Author, authorSchema } from "../../model/author/author";
import { Dispatch, connect } from "react-redux";
import { withStyles } from "../../helpers/withStylesHelper";
import { updateProfileImage } from "../../actions/author";
import { AppState } from "../../reducers";
import { denormalize } from "normalizr";
import { CurrentUser } from "../../model/currentUser";
import CircularProgress from "@material-ui/core/CircularProgress";
// import ArticleSpinner from "../common/spinner/articleSpinner";
const styles = require("./profileImageUpload.scss");

interface ProfileImageUploadProps {
  author: Author;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

interface ProfileImageUploadState {
  imageUrl: string;
  isLoading: boolean;
}

@withStyles<typeof ProfileImageUpload>(styles)
class ProfileImageUpload extends React.PureComponent<ProfileImageUploadProps, ProfileImageUploadState> {
  constructor(props: ProfileImageUploadProps) {
    super(props);

    this.state = {
      imageUrl: "",
      isLoading: false,
    };
  }

  // public componentWillReceiveProps(nextProps: ProfileImageUploadProps) {
  // }

  // public shouldComponentWillUpdate(nextProps: ProfileImageUploadProps) {
  //   console.log(this.props.author.profileImageUrl);
  //   console.log(nextProps.author.profileImageUrl);
  //   return this.state.imageUrl !== nextProps.author.profileImageUrl;
  // }

  public render() {
    const { isLoading } = this.state;
    const { author, currentUser } = this.props;

    if (isLoading) {
      return (
        <span className={styles.nameImgBoxWrapper}>
          <div className={styles.spinnerWrapper}>
            <CircularProgress className={styles.loadingSpinner} disableShrink={true} size={14} thickness={4} />
          </div>
        </span>
      );
    }

    return !author.profileImageUrl ? (
      <span className={styles.nameImgBoxWrapper}>
        <div className={styles.imgBox}>
          {author.name.slice(0, 1).toUpperCase()}
          {author.isLayered && currentUser.author_id === author.id ? this.getImageFileUpload() : null}
        </div>
      </span>
    ) : (
      <span className={styles.profileImgBoxWrapper}>
        <img src={author.profileImageUrl} className={styles.profileImage} />
        {author.isLayered && currentUser.author_id === author.id ? this.getImageFileUpload() : null}
      </span>
    );
  }

  private getImageFileUpload = () => {
    return (
      <form className={styles.imgUploadWrapper}>
        <input
          type="file"
          name="profileImage"
          className={styles.imgUploadBox}
          accept=".jpg, .jpeg, .png"
          onChange={e => {
            this.fileChangedHandler(e);
          }}
        />
      </form>
    );
  };

  private fileChangedHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { author, dispatch } = this.props;
    let file: File | null = null;
    let formData = new FormData();
    if (e.currentTarget.files) {
      file = e.currentTarget.files[0];
      formData.append("profile-image", file);
    }

    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const res = await dispatch(updateProfileImage(author.id, formData));
      if (res && res !== null) {
        this.setState(prevState => ({ ...prevState, isLoading: false }));
      }
    } catch (err) {
      console.log(err);
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };
}

function mapStateToProps(state: AppState) {
  return {
    author: denormalize(state.connectedAuthorShow.authorId, authorSchema, state.entities),
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(ProfileImageUpload);
