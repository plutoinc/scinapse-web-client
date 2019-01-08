import * as React from "react";
import { Dispatch, connect } from "react-redux";
import * as format from "date-fns/format";
import { Experience } from "../../model/profile";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import ExperienceForm, { ExperienceFormState } from "./experienceForm";
import PlutoAxios from "../../api/pluto";
import alertToast from "../../helpers/makePlutoToastAction";
import { AppState } from "../../reducers";
import { updateAuthorCvInfo } from "../../actions/author";
const styles = require("./authorCVItem.scss");

interface ExperienceItemState {
  isEditMode: boolean;
}

interface ExperienceItemProps {
  authorId: number;
  experience: Experience;
  handleRemoveItem: (cvInfoId: string) => void;
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
          <span className={styles.dateContent}>{format(start_date, "MMM YYYY")}</span>
          <span className={styles.dateContent}>- {end_date ? format(end_date, "MMM YYYY") : ""}</span>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.hoverButtonWrapper}>
            <span className={styles.hoverButton} onClick={this.handelToggleExperienceEditForm}>
              <Icon icon="PEN" />
            </span>
            <span
              className={styles.hoverButton}
              onClick={() => {
                handleRemoveItem(id);
              }}
            >
              <Icon icon="X_BUTTON" />
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
    const { dispatch, authorId } = this.props;

    try {
      params.id &&
        (await dispatch(
          updateAuthorCvInfo("experiences", authorId, {
            ...params,
            end_date: params.is_current ? null : params.end_date,
          })
        ));
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

function mapStateToProps(_state: AppState) {
  return {};
}

export default connect(mapStateToProps)(ExperienceItem);
