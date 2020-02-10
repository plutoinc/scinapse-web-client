import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import { AppState } from '../../reducers';
import { CVInfoType } from '../../model/profileInfo';
import Icon from '../../icons';
import AwardForm, { AwardFormState } from '../../components/authorCV/awardForm';
import { postNewAuthorCVInfo, removeAuthorCvInfo, updateAuthorCvInfo } from '../../actions/author';
import EducationForm, { EducationFormState } from '../../components/authorCV/educationForm';
import ExperienceForm, { ExperienceFormState } from '../../components/authorCV/experienceForm';
import ExperienceItem from '../../components/authorCV/experienceItem';
import EducationItem from '../../components/authorCV/educationItem';
import AwardItem from '../../components/authorCV/awardItem';
import { Profile } from '../../model/profile';
import { getProfileCVInformation } from '../../actions/profileInfo';
import ArticleSpinner from '../../components/common/spinner/articleSpinner';
const styles = require('./authorCvSection.scss');

interface ProfileCvSectionState {
  profileInfo: CVInfoType;
  isOpenAwardForm: boolean;
  isOpenEducationForm: boolean;
  isOpenExperienceForm: boolean;
  isLoadingAwardForm: boolean;
  isLoadingEducationForm: boolean;
  isLoadingExperienceForm: boolean;
  isLoadingPage: boolean;
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
      isLoadingPage: false,
      profileInfo: { awards: [], educations: [], experiences: [] },
    };
  }

  public componentDidMount() {
    this.fetchProfileInfo(this.props.profile.id);
  }

  public componentWillReceiveProps(nextProps: ProfileCvSectionProps & Props) {
    if (this.props.profile.id !== nextProps.profile.id) {
      this.fetchProfileInfo(nextProps.profile.id);
    }
  }

  public render() {
    const { isLoadingPage, isLoadingAwardForm, isLoadingEducationForm, isLoadingExperienceForm } = this.state;
    return (
      <div className={styles.leftContentWrapper}>
        {(isLoadingPage || isLoadingAwardForm || isLoadingEducationForm || isLoadingExperienceForm) && (
          <div className={styles.loadingContainer}>
            <ArticleSpinner className={styles.loadingSpinner} />
          </div>
        )}
        <div
          className={classNames({
            [styles.isLoadingPage]:
              isLoadingPage || isLoadingAwardForm || isLoadingEducationForm || isLoadingExperienceForm,
          })}
        >
          {this.getEducationArea()}
          {this.getExperienceArea()}
          {this.getAwardArea()}
        </div>
      </div>
    );
  }

  private fetchProfileInfo = async (profileId: string) => {
    this.setState(state => ({ ...state, isLoadingPage: true }));
    const profileInfo = await getProfileCVInformation(profileId);
    if (profileInfo) {
      this.setState(state => ({ ...state, profileInfo }));
    }
    this.setState(state => ({ ...state, isLoadingPage: false }));
  };

  private getEducationArea = () => {
    return (
      <div className={styles.areaWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Education</span>
        </div>
        <div className={styles.sectionDescription} />
        {this.isValidConnected() && this.getEducationForm()}
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
    const { profile } = this.props;
    const { profileInfo } = this.state;

    if (profileInfo && profileInfo.educations && profileInfo.educations.length > 0) {
      const educations = profileInfo.educations.map(education => {
        return (
          <EducationItem
            validConnection={this.isValidConnected()}
            profileId={profile.id}
            key={education.id}
            education={education}
            onUpdate={this.handleUpdateCVInfo('educations')}
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
    const { profile } = this.props;
    const { profileInfo } = this.state;

    if (profileInfo && profileInfo.experiences && profileInfo.experiences.length > 0) {
      const experiences = profileInfo.experiences.map(experience => {
        return (
          <ExperienceItem
            validConnection={this.isValidConnected()}
            profileId={profile.id}
            key={experience.id}
            experience={experience}
            onUpdate={this.handleUpdateCVInfo('experiences')}
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
    const { profile } = this.props;
    const { profileInfo } = this.state;

    if (profileInfo && profileInfo.awards && profileInfo.awards.length > 0) {
      const awards = profileInfo.awards.map(award => {
        return (
          <AwardItem
            validConnection={this.isValidConnected()}
            profileId={profile.id}
            key={award.id}
            award={award}
            onUpdate={this.handleUpdateCVInfo('awards')}
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

  private handleDeleteCVInfo = (type: keyof CVInfoType) => async (cvInfoId: string) => {
    if (confirm(`Do you really want to delete the ${type.slice(0, -1)} data?`)) {
      this.handleLoadingFlagAuthorCVForm(type);
      const result = await removeAuthorCvInfo(type, cvInfoId);
      this.setState(state => ({ ...state, profileInfo: { ...state.profileInfo, [type]: result } }));
      this.handleLoadingFlagAuthorCVForm(type);
    }
  };

  private handleUpdateCVInfo = (type: keyof CVInfoType) => async (
    cvInfo: EducationFormState | ExperienceFormState | AwardFormState
  ) => {
    const result = await updateAuthorCvInfo(type, cvInfo);
    this.setState(state => ({ ...state, profileInfo: { ...state.profileInfo, [type]: result } }));
  };

  private handleAddCVInfo = (type: keyof CVInfoType) => async (
    cvInfo: EducationFormState | ExperienceFormState | AwardFormState
  ) => {
    const { profile } = this.props;

    this.handleLoadingFlagAuthorCVForm(type);
    const result = await postNewAuthorCVInfo(type, profile.id, cvInfo);
    this.setState(state => ({ ...state, profileInfo: { ...state.profileInfo, [type]: result } }));
    this.handleLoadingFlagAuthorCVForm(type);
    this.handleToggleAuthorCVForm(type)();
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

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(ProfileCvSection);
