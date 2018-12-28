import * as React from "react";
import { denormalize } from "normalizr";
import { Dispatch, connect } from "react-redux";
import { ConnectedAuthorShowState } from "../connectedAuthorShow/reducer";
import { LayoutState } from "../../components/layouts/records";
import { withStyles } from "../../helpers/withStylesHelper";
import { AppState } from "../../reducers";
import { CurrentUser } from "../../model/currentUser";
import { authorSchema, Author } from "../../model/author/author";
import { profileSchema, Profile, Award } from "../../model/profile";
import Icon from "../../icons";
import AwardForm, { AwardFormState } from "../../components/authorCV/awardForm";
import { addAuthorAward, addAuthorEducation, addAuthorExperience } from "../../actions/author";
import PlutoAxios from "../../api/pluto";
import alertToast from "../../helpers/makePlutoToastAction";
import EducationForm, { EducationFormState } from "../../components/authorCV/educationForm";
import ExperienceForm, { ExperienceFormState } from "../../components/authorCV/experienceForm";
const styles = require("./authorCvSection.scss");

interface AuthorCvSectionState {
  isOpenAwardForm: boolean;
}

interface AuthorCvSectionProps {
  layout: LayoutState;
  author: Author;
  authorShow: ConnectedAuthorShowState;
  currentUser: CurrentUser;
  profile: Profile;
  dispatch: Dispatch<any>;
}

@withStyles<typeof AuthorCvSection>(styles)
class AuthorCvSection extends React.PureComponent<AuthorCvSectionProps, AuthorCvSectionState> {
  public constructor(props: AuthorCvSectionProps) {
    super(props);
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
        {this.getEducationForm()}
        {this.getEducationList()}
      </div>
    );
  };

  private getEducationForm = () => {
    return (
      <EducationForm
        handleClose={this.handleToggleAuthorCVForm}
        isOpen={true}
        isLoading={false}
        handleSubmitForm={this.handleSubmitEducation}
        initialValues={{
          degree: "",
          department: "",
          start_date: "",
          end_date: "",
          is_current: false,
          institution: "",
        }}
      />
    );

    // return (
    //   <div className={styles.buttonWrapper}>
    //     <span className={styles.openFormButton}>
    //       <Icon className={styles.plusIcon} icon="SMALL_PLUS" /> Add more
    //     </span>
    //   </div>
    // );
  };

  private getEducationList = () => {
    const { profile } = this.props;
    if (profile.educations && profile.educations.length > 0) {
      const educations = profile.educations.map(education => {
        return (
          <div className={styles.itemWrapper}>
            <div className={styles.dateSectionWrapper}>
              <span className={styles.dateContent}>{education.start_date}</span>
              <span className={styles.dateContent}>- {education.end_date}</span>
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.hoverButtonWrapper}>
                <Icon className={styles.hoverButton} icon="PEN" />
                <Icon className={styles.hoverButton} icon="X_BUTTON" />
              </div>
              <span className={styles.affiliationContent}>{education.institution}</span>
              <span className={styles.subAffiliationContent}>
                {education.department}, {education.degree}
              </span>
            </div>
          </div>
        );
      });

      return educations;
    }

    return (
      <div className={styles.noItemSection}>
        <p className={styles.noItemSectionContext}>There is no educations information.</p>
      </div>
    );
  };
  private getExperienceArea = () => {
    return (
      <div className={styles.areaWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Experience</span>
        </div>
        <div className={styles.sectionDescription} />
        {this.getExperienceForm()}
        {this.getExperienceList()}
      </div>
    );
  };

  private getExperienceForm = () => {
    return (
      <ExperienceForm
        handleClose={this.handleToggleAuthorCVForm}
        isOpen={true}
        isLoading={false}
        handleSubmitForm={this.handleSubmitExperience}
        initialValues={{
          department: "",
          description: "",
          start_date: "",
          end_date: "",
          position: "",
          institution: "",
          is_current: false,
        }}
      />
    );

    // return (
    //   <div className={styles.buttonWrapper}>
    //     <span className={styles.openFormButton}>
    //       <Icon className={styles.plusIcon} icon="SMALL_PLUS" /> Add more
    //     </span>
    //   </div>
    // );
  };

  private getExperienceList = () => {
    const { profile } = this.props;
    if (profile.experiences && profile.experiences.length > 0) {
      const experiences = profile.experiences.map(experience => {
        return (
          <div className={styles.itemWrapper}>
            <div className={styles.dateSectionWrapper}>
              <span className={styles.dateContent}>{experience.start_date}</span>
              <span className={styles.dateContent}>- {experience.end_date}</span>
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.hoverButtonWrapper}>
                <Icon className={styles.hoverButton} icon="PEN" />
                <Icon className={styles.hoverButton} icon="X_BUTTON" />
              </div>
              <span className={styles.affiliationContent}>{experience.position}</span>
              <span className={styles.subAffiliationContent}>
                {experience.institution}, {experience.department}
              </span>
              <span className={styles.detailDescriptionSection}>{experience.description}</span>
            </div>
          </div>
        );
      });

      return experiences;
    }

    return (
      <div className={styles.noItemSection}>
        <p className={styles.noItemSectionContext}>There is no experiences information.</p>
      </div>
    );
  };

  private getAwardArea = () => {
    return (
      <div className={styles.areaWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Award</span>
        </div>
        <div className={styles.sectionDescription} />
        {this.getAwardForm()}
        {this.getAwardList()}
      </div>
    );
  };

  private getAwardForm = () => {
    return (
      <AwardForm
        handleClose={this.handleToggleAuthorCVForm}
        isOpen={true}
        isLoading={false}
        handleSubmitForm={this.handleSubmitAward}
        initialValues={{
          title: "",
          received_date: "",
        }}
      />
    );
    // return (
    //   <div className={styles.buttonWrapper}>
    //     <span className={styles.openFormButton}>
    //       <Icon className={styles.plusIcon} icon="SMALL_PLUS" /> Add more
    //     </span>
    //   </div>
    // );
  };

  private getAwardList = () => {
    const { profile } = this.props;
    if (profile.awards && profile.awards.length > 0) {
      const awards = profile.awards.map(award => {
        return (
          <div className={styles.itemWrapper}>
            <div className={styles.dateSectionWrapper}>
              <span className={styles.dateContent}>{award.received_date}</span>
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.hoverButtonWrapper}>
                <Icon className={styles.hoverButton} icon="PEN" />
                <span>
                  <Icon className={styles.hoverButton} icon="X_BUTTON" />
                </span>
              </div>
              <span className={styles.awardTitleContent}>{award.title}</span>
            </div>
          </div>
        );
      });

      return awards;
    }
    return (
      <div className={styles.noItemSection}>
        <p className={styles.noItemSectionContext}>There is no awards information.</p>
      </div>
    );
  };

  private handleDeleteCVInfo = async (cvInfoId: string, cvInfoType: string) => {
    const { dispatch } = this.props;

    switch (cvInfoType) {
      case "education":
        try {
          await dispatch(deleteAuthorEducation(cvInfoId));
        } catch (err) {
          const error = PlutoAxios.getGlobalError(err);
          console.error(error);
          alertToast({
            type: "error",
            message: "Had an error to delete education data.",
          });
        }
        break;
      case "experience":
        try {
          await dispatch(deleteAuthorExperience(cvInfoId));
        } catch (err) {
          const error = PlutoAxios.getGlobalError(err);
          console.error(error);
          alertToast({
            type: "error",
            message: "Had an error to delete experience data.",
          });
        }

        break;
      case "award":
        try {
          await dispatch(deleteAuthorAward(cvInfoId));
        } catch (err) {
          const error = PlutoAxios.getGlobalError(err);
          console.error(error);
          alertToast({
            type: "error",
            message: "Had an error to delete award data.",
          });
        }

        break;
      default:
        break;
    }
  };

  private handleSubmitEducation = async (education: EducationFormState) => {
    const { dispatch, author } = this.props;
    try {
      await dispatch(
        addAuthorEducation(author.id, {
          degree: education.degree,
          department: education.department,
          start_date: education.start_date,
          end_date: education.end_date,
          is_current: education.is_current,
          institution: education.institution,
        })
      );
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to add award data.",
      });
    }
  };

  private handleSubmitExperience = async (experience: ExperienceFormState) => {
    const { dispatch, author } = this.props;
    try {
      await dispatch(
        addAuthorExperience(author.id, {
          department: experience.department,
          description: experience.description,
          start_date: experience.start_date,
          end_date: experience.end_date,
          position: experience.position,
          institution: experience.institution,
          is_current: experience.is_current,
        })
      );
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to add award data.",
      });
    }
  };

  private handleSubmitAward = async (award: AwardFormState) => {
    const { dispatch, author } = this.props;
    try {
      await dispatch(
        addAuthorAward(author.id, {
          title: award.title,
          received_date: award.received_date,
        })
      );
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to add award data.",
      });
    }
  };

  private handleToggleAuthorCVForm = () => {
    const { isOpenAwardForm } = this.state;

    this.setState(prevState => ({ ...prevState, isOpenAwardForm: !isOpenAwardForm }));
  };
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    authorShow: state.connectedAuthorShow,
    currentUser: state.currentUser,
    profile: denormalize(state.connectedAuthorShow.authorId, profileSchema, state.entities),
    author: denormalize(state.connectedAuthorShow.authorId, authorSchema, state.entities),
  };
}

export default connect(mapStateToProps)(AuthorCvSection);
