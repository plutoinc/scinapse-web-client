import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../helpers/withStylesHelper';
import { updateProfileImage } from '../../actions/author';
import { CurrentUser } from '../../model/currentUser';
import alertToast from '../../helpers/makePlutoToastAction';
import Icon from '../../icons';
import { Profile } from '../../model/profile';
const styles = require('./uploadableProfileImage.scss');

const LIMIT_FILE_SIZE = 3 * 1024 * 1024;

interface UploadableProfileImageProps {
  profile: Profile;
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
    const { profile } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <span className={styles.nameImgBoxWrapper}>
          <div className={styles.spinnerWrapper}>
            <CircularProgress className={styles.loadingSpinner} disableShrink={true} size={14} thickness={4} />
          </div>
        </span>
      );
    }

    return !profile.profileImageUrl ? (
      <span className={styles.nameImgBoxWrapper}>
        <div className={styles.imgBox}>
          {profile.firstName.slice(0, 1).toUpperCase()}
          {profile.isEditable && this.getImageFileUpload()}
          {profile.isEditable && <CameraBackground />}
        </div>
      </span>
    ) : (
      <span className={styles.profileImgBoxWrapper}>
        <div
          style={{
            backgroundImage: `url(${profile.profileImageUrl})`,
          }}
          className={styles.profileImage}
        />
        {profile.isEditable && this.getImageFileUpload()}
        {profile.isEditable && <CameraBackground />}
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
    const { profile, dispatch } = this.props;
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
    await dispatch(updateProfileImage(profile.slug, formData));
    this.setState({ isLoading: false });
  };
}

export default connect()(UploadableProfileImage);
