import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Author } from '../../model/author/author';
import { withStyles } from '../../helpers/withStylesHelper';
import { updateProfileImage } from '../../actions/author';
import { CurrentUser } from '../../model/currentUser';
import alertToast from '../../helpers/makePlutoToastAction';
import Icon from '../../icons';
const styles = require('./uploadableProfileImage.scss');

const LIMIT_FILE_SIZE = 3 * 1024 * 1024;

interface UploadableProfileImageProps {
  author: Author;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

const CameraBackground: React.SFC = () => {
  return (
    <div className={styles.cameraWrapper}>
      <Icon icon="CAMERA" className={styles.cameraIcon} />
    </div>
  );
};

@withStyles<typeof UploadableProfileImage>(styles)
class UploadableProfileImage extends React.PureComponent<UploadableProfileImageProps, { isLoading: boolean }> {
  public constructor(props: UploadableProfileImageProps) {
    super(props);

    this.state = { isLoading: false };
  }

  public render() {
    const { author, currentUser } = this.props;
    const { isLoading } = this.state;
    const isMine = author.isLayered && currentUser.authorId === author.id;

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
          {isMine && this.getImageFileUpload()}
          {isMine && <CameraBackground />}
        </div>
      </span>
    ) : (
      <span className={styles.profileImgBoxWrapper}>
        <div
          style={{
            backgroundImage: `url(${author.profileImageUrl})`,
          }}
          className={styles.profileImage}
        />
        {isMine && this.getImageFileUpload()}
        {isMine && <CameraBackground />}
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
    const formData = new FormData();

    if (e.currentTarget.files) {
      const file = e.currentTarget.files[0];
      if (file.size >= LIMIT_FILE_SIZE) {
        return alertToast({
          type: 'error',
          message: 'The size of the profile image is limited up to 3MB.',
        });
      }

      formData.append('profile-image', file);
    }

    this.setState({ isLoading: true });
    await dispatch(updateProfileImage(author.id, formData));
    this.setState({ isLoading: false });
  };
}

export default connect()(UploadableProfileImage);
