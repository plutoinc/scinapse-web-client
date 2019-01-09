import * as React from "react";
import { Dispatch, connect } from "react-redux";
import * as format from "date-fns/format";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { Education } from "../../model/profile";
import EducationForm, { EducationFormState } from "./educationForm";
import { AppState } from "../../reducers";
import PlutoAxios from "../../api/pluto";
import alertToast from "../../helpers/makePlutoToastAction";
import { updateAuthorCvInfo } from "../../actions/author";
import { getFormatingDate, getMonthOptionItems } from "../../containers/authorCvSection";
const styles = require("./authorCVItem.scss");

interface EducationItemState {
  isEditMode: boolean;
}

interface EducationItemProps {
  authorId: number;
  education: Education;
  handleRemoveItem: (cvInfoId: string) => void;
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
        monthItems={getMonthOptionItems()}
        handleClose={this.handelToggleEducationEditForm}
        isOpen={true}
        isLoading={false}
        handleSubmitForm={this.handelUpdateEducation}
        initialValues={{
          id,
          degree,
          department,
          is_current,
          institution_id,
          institution_name,
          start_date,
          end_date,
          start_date_year: start_date.split("-")[0],
          start_date_month: start_date.split("-")[1],
          end_date_year: end_date ? end_date.split("-")[0] : "",
          end_date_month: end_date ? end_date.split("-")[1] : "",
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
            <span className={styles.hoverButton} onClick={this.handelToggleEducationEditForm}>
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
    const { dispatch, authorId } = this.props;

    params.start_date = getFormatingDate(params.start_date_year, params.start_date_month);
    params.end_date = getFormatingDate(params.end_date_year, params.end_date_month);

    try {
      params.id &&
        (await dispatch(
          updateAuthorCvInfo("educations", authorId, {
            ...params,
            end_date: params.is_current ? null : params.end_date,
          })
        ));
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

function mapStateToProps(_state: AppState) {
  return {};
}

export default connect(mapStateToProps)(EducationItem);
