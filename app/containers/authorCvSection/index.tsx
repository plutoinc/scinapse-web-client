import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '../../helpers/withStylesHelper';
import { AppState } from '../../reducers';
import { CVInfoType, selectHydratedProfileInfo } from '../../model/profileInfo';
import Icon from '../../icons';
import AwardForm, { AwardFormState } from '../../components/authorCV/awardForm';
import { postNewAuthorCVInfo, removeAuthorCvInfo } from '../../actions/author';
import EducationForm, { EducationFormState } from '../../components/authorCV/educationForm';
import ExperienceForm, { ExperienceFormState } from '../../components/authorCV/experienceForm';
import ExperienceItem from '../../components/authorCV/experienceItem';
import EducationItem from '../../components/authorCV/educationItem';
import AwardItem from '../../components/authorCV/awardItem';
import alertToast from '../../helpers/makePlutoToastAction';
import { Profile } from '../../model/profile';
const styles = require('./authorCvSection.scss');

interface ProfileCvSectionState {
  isOpenAwardForm: boolean;
  isOpenEducationForm: boolean;
  isOpenExperienceForm: boolean;
  isLoadingAwardForm: boolean;
  isLoadingEducationForm: boolean;
  isLoadingExperienceForm: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: Dispatch<any>;
};

interface ProfileCvSectionProps {
  profile: Profile;
}

@withStyles<typeof ProfileCvSection>(styles)
class ProfileCvSection extends React.PureComponent<ProfileCvSectionProps & Props, ProfileCvSectionState> {
  public constructor(props: ProfileCvSectionProps & Props) {
    super(props);

    this.state = {
      isOpenAwardForm: false,
      isOpenEducationForm: false,
      isOpenExperienceForm: false,
      isLoadingAwardForm: false,
      isLoadingEducationForm: false,
      isLoadingExperienceForm: false,
    };
  }

  public render() {
    return (
      <div className={styles.leftContentWrapper}>
        {this.getEducationArea()}
        {this.getExperienceArea()}
        {this.getAwardArea()}
      </div>
    );
  }

  private getEducationArea = () => {
    return (
      <div className={styles.areaWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Education</span>
        </div>
        <div className={styles.sectionDescription} />
        {this.isValidConnected() ? this.getEducationForm() : null}
        {this.getEducationList()}
      </div>
    );
  };

  private getEducationForm = () => {
    const { isOpenEducationForm, isLoadingEducationForm } = this.state;

    return isOpenEducationForm ? (
      <EducationForm
        wrapperStyle={{ display: 'inline-flex', position: 'relative' }}
        inputStyle={{
          color: '#666d7c',
          fontSize: '13px',
          lineHeight: '1.54',
          fontFamily: 'Roboto',
          padding: '8px',
        }}
        handleClose={this.handleToggleAuthorCVForm('educations')}
        isOpen={true}
        isLoading={isLoadingEducationForm}
        handleSubmitForm={this.handleAddCVInfo('educations')}
        initialValues={{
          degree: '',
          department: '',
          isCurrent: false,
          institutionName: '',
          institutionId: null,
          startDate: '',
          endDate: '',
        }}
      />
    ) : (
      <div className={styles.buttonWrapper}>
        <span className={styles.openFormButton} onClick={this.handleToggleAuthorCVForm('educations')}>
          <Icon className={styles.plusIcon} icon="PLUS" /> Add more
        </span>
      </div>
    );
  };

  private getEducationList = () => {
    const { profile, profileInfo } = this.props;

    if (profileInfo && profileInfo.educations && profileInfo.educations.length > 0) {
      const educations = profileInfo.educations.map(education => {
        return (
          <EducationItem
            validConnection={this.isValidConnected()}
            profileId={profile.id}
            key={education.id}
            education={education}
            handleRemoveItem={this.handleDeleteCVInfo('educations')}
          />
        );
      });

      return educations;
    }

    return null;
  };

  private getExperienceArea = () => {
    return (
      <div className={styles.areaWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Experience</span>
        </div>
        <div className={styles.sectionDescription} />
        {this.isValidConnected() ? this.getExperienceForm() : null}
        {this.getExperienceList()}
      </div>
    );
  };

  private getExperienceForm = () => {
    const { isOpenExperienceForm, isLoadingExperienceForm } = this.state;

    return isOpenExperienceForm ? (
      <ExperienceForm
        wrapperStyle={{ display: 'inline-flex', position: 'relative' }}
        inputStyle={{
          color: '#666d7c',
          fontSize: '13px',
          lineHeight: '1.54',
          fontFamily: 'Roboto',
          padding: '8px',
        }}
        handleClose={this.handleToggleAuthorCVForm('experiences')}
        isOpen={true}
        isLoading={isLoadingExperienceForm}
        handleSubmitForm={this.handleAddCVInfo('experiences')}
        initialValues={{
          department: '',
          description: '',
          position: '',
          institutionId: null,
          institutionName: '',
          isCurrent: false,
          startDate: '',
          endDate: '',
        }}
      />
    ) : (
      <div className={styles.buttonWrapper}>
        <span className={styles.openFormButton} onClick={this.handleToggleAuthorCVForm('experiences')}>
          <Icon className={styles.plusIcon} icon="PLUS" /> Add more
        </span>
      </div>
    );
  };

  private getExperienceList = () => {
    const { profile, profileInfo } = this.props;
    if (profileInfo && profileInfo.experiences && profileInfo.experiences.length > 0) {
      const experiences = profileInfo.experiences.map(experience => {
        return (
          <ExperienceItem
            validConnection={this.isValidConnected()}
            profileId={profile.id}
            key={experience.id}
            experience={experience}
            handleRemoveItem={this.handleDeleteCVInfo('experiences')}
          />
        );
      });

      return experiences;
    }

    return null;
  };

  private getAwardArea = () => {
    return (
      <div className={styles.areaWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Award</span>
        </div>
        <div className={styles.sectionDescription} />
        {this.isValidConnected() ? this.getAwardForm() : null}
        {this.getAwardList()}
      </div>
    );
  };

  private getAwardForm = () => {
    const { isOpenAwardForm, isLoadingAwardForm } = this.state;

    return isOpenAwardForm ? (
      <AwardForm
        handleClose={this.handleToggleAuthorCVForm('awards')}
        isOpen={true}
        isLoading={isLoadingAwardForm}
        handleSubmitForm={this.handleAddCVInfo('awards')}
        initialValues={{
          title: '',
          receivedDate: '',
          relatedLink: '',
        }}
      />
    ) : (
      <div className={styles.buttonWrapper}>
        <span className={styles.openFormButton} onClick={this.handleToggleAuthorCVForm('awards')}>
          <Icon className={styles.plusIcon} icon="PLUS" /> Add more
        </span>
      </div>
    );
  };

  private getAwardList = () => {
    const { profile, profileInfo } = this.props;

    if (profileInfo && profileInfo.awards && profileInfo.awards.length > 0) {
      const awards = profileInfo.awards.map(award => {
        return (
          <AwardItem
            validConnection={this.isValidConnected()}
            profileId={profile.id}
            key={award.id}
            award={award}
            handleRemoveItem={this.handleDeleteCVInfo('awards')}
          />
        );
      });

      return awards;
    }
    return null;
  };

  private isValidConnected = () => {
    return this.props.profile.isEditable;
  };

  private handleDeleteCVInfo = (cvInfoType: keyof CVInfoType) => (cvInfoId: string) => {
    const { profile, dispatch } = this.props;
    if (confirm(`Do you really want to delete the ${cvInfoType.slice(0, -1)} data?`)) {
      dispatch(removeAuthorCvInfo(cvInfoType, profile.id, cvInfoId));
    }
  };

  private handleAddCVInfo = (cvInfoType: keyof CVInfoType) => async (
    cvInfo: EducationFormState | ExperienceFormState | AwardFormState
  ) => {
    const { profile, dispatch } = this.props;

    this.handleLoadingFlagAuthorCVForm(cvInfoType);

    try {
      await dispatch(postNewAuthorCVInfo(cvInfoType, profile.id, cvInfo));
      this.handleLoadingFlagAuthorCVForm(cvInfoType);
      this.handleToggleAuthorCVForm(cvInfoType)();
    } catch (err) {
      this.handleLoadingFlagAuthorCVForm(cvInfoType);
      alertToast({
        type: 'error',
        message: `Had an error to add ${cvInfoType} data.`,
      });
    }
  };

  private handleToggleAuthorCVForm = (formType: keyof CVInfoType) => () => {
    const { isOpenAwardForm, isOpenEducationForm, isOpenExperienceForm } = this.state;

    switch (formType) {
      case 'awards':
        this.setState(prevState => ({ ...prevState, isOpenAwardForm: !isOpenAwardForm }));
        break;
      case 'educations':
        this.setState(prevState => ({
          ...prevState,
          isOpenEducationForm: !isOpenEducationForm,
        }));
        break;
      case 'experiences':
        this.setState(prevState => ({
          ...prevState,
          isOpenExperienceForm: !isOpenExperienceForm,
        }));
        break;
      default:
        break;
    }
  };

  private handleLoadingFlagAuthorCVForm = (formType: keyof CVInfoType) => {
    const { isLoadingAwardForm, isLoadingEducationForm, isLoadingExperienceForm } = this.state;

    switch (formType) {
      case 'awards':
        this.setState(prevState => ({ ...prevState, isLoadingAwardForm: !isLoadingAwardForm }));
        break;
      case 'educations':
        this.setState(prevState => ({ ...prevState, isLoadingEducationForm: !isLoadingEducationForm }));
        break;
      case 'experiences':
        this.setState(prevState => ({ ...prevState, isLoadingExperienceForm: !isLoadingExperienceForm }));
        break;
      default:
        break;
    }
  };
}

function mapStateToProps(state: AppState, props: ProfileCvSectionProps) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
    profileInfo: selectHydratedProfileInfo(state, props.profile.id),
  };
}

export default connect(mapStateToProps)(ProfileCvSection);
