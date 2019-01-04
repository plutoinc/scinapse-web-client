import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { Education } from "../../model/profile";
import EducationForm, { EducationFormState } from "./educationForm";
import { Dispatch, connect } from "react-redux";
import { AppState } from "../../reducers";
import { updateAuthorEducation } from "../../actions/author";
import PlutoAxios from "../../api/pluto";
import alertToast from "../../helpers/makePlutoToastAction";
const styles = require("./authorCVItem.scss");

interface EducationItemState {
  isEditMode: boolean;
}

interface EducationItemProps {
  education: Education;
  handleRemoveItem: (cvInfoId: string, cvInfoType: string) => Promise<void>;
  dispatch: Dispatch<any>;
}

@withStyles<typeof EducationItem>(styles)
class EducationItem extends React.PureComponent<EducationItemProps, EducationItemState> {
  public constructor(props: EducationItemProps) {
    super(props);

    this.state = {
      isEditMode: false,
    };
  }

  public render() {
    const { education, handleRemoveItem } = this.props;
    const { isEditMode } = this.state;
    const { id, degree, department, start_date, end_date, is_current, institution_name, institution_id } = education;
    return isEditMode ? (
      <EducationForm
        handleClose={this.handelToggleEducationEditForm}
        isOpen={true}
        isLoading={false}
        handleSubmitForm={this.handelUpdateEducation}
        initialValues={{
          id,
          degree,
          department,
          start_date,
          end_date,
          is_current,
          institution_id,
          institution_name,
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
            <span onClick={this.handelToggleEducationEditForm}>
              <Icon className={styles.hoverButton} icon="PEN" />
            </span>
            <span
              onClick={() => {
                handleRemoveItem(id, "education");
              }}
            >
              <Icon className={styles.hoverButton} icon="X_BUTTON" />
            </span>
          </div>
          <span className={styles.affiliationContent}>{institution_name}</span>
          <span className={styles.subAffiliationContent}>
            {department}, {degree}
          </span>
        </div>
      </div>
    );
  }

  private handelToggleEducationEditForm = () => {
    const { isEditMode } = this.state;

    this.setState({ isEditMode: !isEditMode });
  };

  private handelUpdateEducation = async (params: EducationFormState) => {
    const { dispatch } = this.props;
    console.log(params);
    try {
      params.id && (await dispatch(updateAuthorEducation(params)));
      this.handelToggleEducationEditForm();
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

export default connect(mapStateToProps)(EducationItem);
