import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import EducationForm from "./components/educationForm";
import { Profile } from "../../model/profile";
import ExperienceForm from "./components/experienceForm";
import AwardForm from "./components/awardForm";
const styles = require("./profileMeta.scss");

enum ProfileMetaEnum {
  EDUCATION = "EDUCATION",
  EXPERIENCE = "EXPERIENCE",
  PUBLICATIONS = "PUBLICATIONS",
  AWARD = "AWARD",
}

interface ProfileMetaProps {
  profile: Profile;
}

type ProfileEditState = { [P in ProfileMetaEnum]: boolean };

interface ProfileMetaState extends ProfileEditState {
  isLoading: false;
}

@withStyles<typeof ProfileMeta>(styles)
class ProfileMeta extends React.PureComponent<ProfileMetaProps, ProfileMetaState> {
  public constructor(props: ProfileMetaProps) {
    super(props);

    this.state = {
      EDUCATION: false,
      EXPERIENCE: false,
      PUBLICATIONS: false,
      AWARD: false,
      isLoading: false,
    };
  }

  public render() {
    const { profile } = this.props;

    return (
      <div>
        <div className={styles.metaTitle}>Education</div>
        {this.state.EDUCATION ? (
          <EducationForm
            profile={profile}
            toggleEducationFormBox={() => {
              this.toggleProfileMetaEditMode(ProfileMetaEnum.EDUCATION);
            }}
          />
        ) : null}
        {this.getAddMoreButton(ProfileMetaEnum.EDUCATION)}
        <div className={styles.metaTitle}>Experience</div>
        {this.state.EXPERIENCE ? (
          <ExperienceForm
            profile={profile}
            toggleExperienceFormBox={() => {
              this.toggleProfileMetaEditMode(ProfileMetaEnum.EXPERIENCE);
            }}
          />
        ) : null}
        {this.getAddMoreButton(ProfileMetaEnum.EXPERIENCE)}
        <div className={styles.metaTitle}>Selected Publications</div>
        {this.getAddMoreButton(ProfileMetaEnum.PUBLICATIONS)}
        <div className={styles.metaTitle}>Award</div>
        {this.state.AWARD ? (
          <AwardForm
            profile={profile}
            toggleAwardFormBox={() => {
              this.toggleProfileMetaEditMode(ProfileMetaEnum.AWARD);
            }}
          />
        ) : null}
        {this.getAddMoreButton(ProfileMetaEnum.AWARD)}
      </div>
    );
  }

  private getAddMoreButton = (type: ProfileMetaEnum) => {
    return (
      <div
        className={styles.addMoreButton}
        onClick={() => {
          this.toggleProfileMetaEditMode(type);
        }}
      >
        <span className={styles.plusIconWrapper}>
          <Icon className={styles.plusIcon} icon="SMALL_PLUS" />
        </span>
        <span className={styles.addText}>Add More</span>
      </div>
    );
  };

  private toggleProfileMetaEditMode = (type: ProfileMetaEnum) => {
    this.setState(prevState => ({ ...prevState, [type]: !this.state[type] }));
  };
}

export default ProfileMeta;
