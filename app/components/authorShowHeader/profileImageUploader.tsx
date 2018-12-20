import * as React from "react";
import { Author, authorSchema } from "../../model/author/author";
import { Dispatch, connect } from "react-redux";
import { withStyles } from "../../helpers/withStylesHelper";
import { updateProfileImage } from "../../actions/author";
import { AppState } from "../../reducers";
import { denormalize } from "normalizr";
const styles = require("./profileImageUploader.scss");

interface ProfileImageUploaderProps {
  author: Author;
  dispatch: Dispatch<any>;
}

interface ProfileImageUploaderState {
  imageUrl: string;
  imageFile: File | null;
}

@withStyles<typeof ProfileImageUploader>(styles)
class ProfileImageUploader extends React.PureComponent<ProfileImageUploaderProps, ProfileImageUploaderState> {
  constructor(props: ProfileImageUploaderProps) {
    super(props);

    this.state = {
      imageUrl: "",
      imageFile: null,
    };
  }

  public render() {
    const { author } = this.props;
    return !author.profileImageUrl ? (
      <span className={styles.nameImgBoxWrapper}>
        <div className={styles.imgBox}>
          {author.name.slice(0, 1).toUpperCase()}
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
        </div>
      </span>
    ) : (
      <span>
        <img src={author.profileImageUrl} className={styles.profileImage} />
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
      </span>
    );
  }

  private fileChangedHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { author, dispatch } = this.props;
    let file: File | null = null;
    let formData = new FormData();
    if (e.currentTarget.files) {
      file = e.currentTarget.files[0];
      formData.append("profile-image", file);
    }

    console.log(file);

    if (file) {
      this.setState(prevState => ({ ...prevState, imageFile: file }));
    }

    try {
      const test = await dispatch(updateProfileImage(author.id, formData));
      console.log("testset" + test);
    } catch (err) {
      console.log(err);
    }
  };
}

function mapStateToProps(state: AppState) {
  return {
    author: denormalize(state.connectedAuthorShow.authorId, authorSchema, state.entities),
  };
}

export default connect(mapStateToProps)(ProfileImageUploader);
