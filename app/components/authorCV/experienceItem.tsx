import * as React from "react";
import { Experience } from "../../model/profile";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import ExperienceForm, { ExperienceFormState } from "./experienceForm";
import { updateAuthorExperience } from "../../actions/author";
import PlutoAxios from "../../api/pluto";
import alertToast from "../../helpers/makePlutoToastAction";
import { Dispatch, connect } from "react-redux";
import { AppState } from "../../reducers";
const styles = require("./authorCVItem.scss");

interface ExperienceItemState {
  isEditMode: boolean;
}

interface ExperienceItemProps {
  experience: Experience;
  handleRemoveItem: (cvInfoId: string, cvInfoType: string) => Promise<void>;
  dispatch: Dispatch<any>;
}

@withStyles<typeof ExperienceItem>(styles)
class ExperienceItem extends React.PureComponent<ExperienceItemProps, ExperienceItemState> {
  public constructor(props: ExperienceItemProps) {
    super(props);

    this.state = {
      isEditMode: false,
    };
  }

  public render() {
    const { experience, handleRemoveItem } = this.props;
    const { isEditMode } = this.state;
    const {
      id,
      position,
      department,
      description,
      start_date,
      end_date,
      institution_id,
      institution_name,
      is_current,
    } = experience;
    return isEditMode ? (
      <ExperienceForm
        handleClose={this.handelToggleExperienceEditForm}
        isOpen={true}
        isLoading={false}
        handleSubmitForm={this.handelUpdateExperience}
        initialValues={{
          id,
          department,
          description,
          start_date,
          end_date,
          position,
          institution_id,
          institution_name,
          is_current,
        }}
      />
    ) : (
      <div className={styles.itemWrapper}>
        <div className={styles.dateSectionWrapper}>
          <span className={styles.dateContent}>{start_date}</span>
          <span className={styles.dateContent}>- {end_date}</span>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.hoverButtonWrapper}>
            <span onClick={this.handelToggleExperienceEditForm}>
              <Icon className={styles.hoverButton} icon="PEN" />
            </span>
            <span
              onClick={() => {
                handleRemoveItem(id, "experience");
              }}
            >
              <Icon className={styles.hoverButton} icon="X_BUTTON" />
            </span>
          </div>
          <span className={styles.affiliationContent}>{position}</span>
          <span className={styles.subAffiliationContent}>
            {institution_name}, {department}
          </span>
          <span className={styles.detailDescriptionSection}>{description}</span>
        </div>
      </div>
    );
  }

  private handelToggleExperienceEditForm = () => {
    const { isEditMode } = this.state;

    this.setState({ isEditMode: !isEditMode });
  };

  private handelUpdateExperience = async (params: ExperienceFormState) => {
    const { dispatch } = this.props;
    console.log(params);
    try {
      params.id && (await dispatch(updateAuthorExperience(params)));
      this.handelToggleExperienceEditForm();
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to add award data.",
      });
    }
  };
}

function mapStateToProps(state: AppState) {
  return {};
}

export default connect(mapStateToProps)(ExperienceItem);
