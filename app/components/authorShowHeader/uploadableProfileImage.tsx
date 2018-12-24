import * as React from "react";
import { Author, authorSchema } from "../../model/author/author";
import { Dispatch, connect } from "react-redux";
import { withStyles } from "../../helpers/withStylesHelper";
import { updateProfileImage } from "../../actions/author";
import { AppState } from "../../reducers";
import { denormalize } from "normalizr";
import { CurrentUser } from "../../model/currentUser";
import CircularProgress from "@material-ui/core/CircularProgress";
const styles = require("./uploadableProfileImage.scss");

interface UploadableProfileImageProps {
  author: Author;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
  isLoading: boolean;
}

@withStyles<typeof UploadableProfileImage>(styles)
class UploadableProfileImage extends React.PureComponent<UploadableProfileImageProps> {
  constructor(props: UploadableProfileImageProps) {
    super(props);
  }

  public render() {
    const { author, currentUser, isLoading } = this.props;

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
          onChange={this.fileChangedHandler}
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
      await dispatch(updateProfileImage(author.id, formData));
    } catch (err) {
      console.log(err);
    }
  };
}

function mapStateToProps(state: AppState) {
  return {
    author: denormalize(state.connectedAuthorShow.authorId, authorSchema, state.entities),
    currentUser: state.currentUser,
    isLoading: state.connectedAuthorShow.isLoadingToUpdateProfileImage,
  };
}

export default connect(mapStateToProps)(UploadableProfileImage);
