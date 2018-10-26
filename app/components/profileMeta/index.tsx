import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import EducationForm from "./components/educationForm";
import { Profile, Award, Experience, Education } from "../../model/profile";
import ExperienceForm from "./components/experienceForm";
import AwardForm from "./components/awardForm";
const styles = require("./profileMeta.scss");

export enum ProfileMetaEnum {
  EDUCATION = "EDUCATION",
  EXPERIENCE = "EXPERIENCE",
  PUBLICATIONS = "PUBLICATIONS",
  AWARD = "AWARD",
}

interface ProfileMetaProps {
  profile: Profile;
  isMine: boolean;
  handleAddMetaItem: (profileMetaType: ProfileMetaEnum, meta: Education | Experience | Award) => void;
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
    const { profile, handleAddMetaItem } = this.props;

    return (
      <div>
        <div className={styles.metaWrapper}>
          <div className={styles.metaTitle}>Education</div>
          {this.state.EDUCATION ? (
            <EducationForm
              profile={profile}
              handleAddMetaItem={handleAddMetaItem}
              toggleEducationFormBox={() => {
                this.toggleProfileMetaEditMode(ProfileMetaEnum.EDUCATION);
              }}
            />
          ) : null}
          {this.getAddMoreButton(ProfileMetaEnum.EDUCATION)}
          {this.getEducationList()}
        </div>
        <div className={styles.metaWrapper}>
          <div className={styles.metaTitle}>Experience</div>
          {this.state.EXPERIENCE ? (
            <ExperienceForm
              profile={profile}
              handleAddMetaItem={handleAddMetaItem}
              toggleExperienceFormBox={() => {
                this.toggleProfileMetaEditMode(ProfileMetaEnum.EXPERIENCE);
              }}
            />
          ) : null}
          {this.getAddMoreButton(ProfileMetaEnum.EXPERIENCE)}
          {this.getExperienceList()}
        </div>
        <div className={styles.metaWrapper}>
          <div className={styles.metaTitle}>Selected Publications</div>
          {this.getAddMoreButton(ProfileMetaEnum.PUBLICATIONS)}
        </div>
        <div className={styles.metaWrapper}>
          <div className={styles.metaTitle}>Award</div>
          {this.state.AWARD ? (
            <AwardForm
              profile={profile}
              handleAddMetaItem={handleAddMetaItem}
              toggleAwardFormBox={() => {
                this.toggleProfileMetaEditMode(ProfileMetaEnum.AWARD);
              }}
            />
          ) : null}
          {this.getAddMoreButton(ProfileMetaEnum.AWARD)}
          {this.getAwardList()}
        </div>
      </div>
    );
  }

  private getDateSection = (startDate: string, endDate?: string) => {
    return (
      <span className={styles.metaDate}>
        <div>{startDate}</div>
        <div>{endDate ? `- ${endDate}` : ""}</div>
      </span>
    );
  };

  private getMetaContent = (title: string, subtitle: string | null) => {
    return (
      <span className={styles.metaContent}>
        <div className={styles.metaContentTitle}>{title}</div>
        <div className={styles.metaSubtitle}>{subtitle || ""}</div>
      </span>
    );
  };

  private getEducationList = () => {
    const { profile } = this.props;

    if (profile && profile.educations) {
      const educations = profile.educations.map(edu => {
        return (
          <li className={styles.metaListItem} key={edu.id}>
            {this.getDateSection(edu.start_date, edu.end_date)}
            {this.getMetaContent(edu.institution, `${edu.department}, ${edu.degree}`)}
          </li>
        );
      });

      return <ul className={styles.metaList}>{educations}</ul>;
    }
    return null;
  };

  private getExperienceList = () => {
    const { profile } = this.props;

    if (profile && profile.experiences) {
      const experiences = profile.experiences.map(exp => {
        return (
          <li className={styles.metaListItem} key={exp.id}>
            {this.getDateSection(exp.start_date, exp.end_date)}
            {this.getMetaContent(exp.institution, `${exp.department}, ${exp.position}`)}
          </li>
        );
      });

      return <ul className={styles.metaList}>{experiences}</ul>;
    }
    return null;
  };

  private getAwardList = () => {
    const { profile } = this.props;

    if (profile && profile.awards) {
      const awards = profile.awards.map(award => {
        return (
          <li className={styles.metaListItem} key={award.id}>
            {this.getDateSection(award.received_date)}
            {this.getMetaContent(award.title, award.description)}
          </li>
        );
      });

      return <ul className={styles.metaList}>{awards}</ul>;
    }
    return null;
  };

  private getAddMoreButton = (type: ProfileMetaEnum) => {
    const { isMine } = this.props;

    const targetType = ProfileMetaEnum[type];

    if (!isMine || this.state[targetType]) {
      return null;
    }

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
