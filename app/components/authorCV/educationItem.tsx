import * as React from "react";
import { Dispatch, connect } from "react-redux";
import * as format from "date-fns/format";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { Education } from "../../model/profile";
import EducationForm, { EducationFormState } from "./educationForm";
import PlutoAxios from "../../api/pluto";
import alertToast from "../../helpers/makePlutoToastAction";
import { updateAuthorCvInfo } from "../../actions/author";
import { getFormattingDate, getMonthOptionItems } from "../../containers/authorCvSection";
const styles = require("./authorCVItem.scss");

interface EducationItemState {
  isEditMode: boolean;
}

interface EducationItemProps {
  validConnection: boolean;
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
        wrapperStyle={{ display: "inline-flex", position: "relative" }}
        inputStyle={{
          color: "#666d7c",
          fontSize: "13px",
          lineHeight: "1.54",
          fontFamily: "Roboto",
          padding: "8px",
        }}
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
          <span className={styles.dateContent}>- {end_date ? format(end_date, "MMM YYYY") : "Present"}</span>
        </div>
        <div className={styles.contentWrapper}>
          {this.getEditItemButtons(id)}
          <span className={styles.affiliationContent}>{institution_name}</span>
          <span className={styles.subAffiliationContent}>
            {department}, {degree}
          </span>
        </div>
      </div>
    );
  }

  private getEditItemButtons = (id: string) => {
    const { validConnection, handleRemoveItem } = this.props;

    if (validConnection) {
      return (
        <div className={styles.hoverButtonWrapper}>
          <span className={styles.hoverEditButton} onClick={this.handelToggleEducationEditForm}>
            <Icon icon="PEN" />
          </span>
          <span
            className={styles.hoverDeleteButton}
            onClick={() => {
              handleRemoveItem(id);
            }}
          >
            <Icon icon="X_BUTTON" />
          </span>
        </div>
      );
    }
    return null;
  };

  private handelToggleEducationEditForm = () => {
    const { isEditMode } = this.state;

    this.setState({ isEditMode: !isEditMode });
  };

  private handelUpdateEducation = async (params: EducationFormState) => {
    const { dispatch, authorId } = this.props;

    const finalParams = {
      ...params,
      start_date: getFormattingDate(params.start_date_year, params.start_date_month),
      end_date: getFormattingDate(params.end_date_year, params.end_date_month),
    };

    try {
      finalParams.id &&
        (await dispatch(
          updateAuthorCvInfo("educations", authorId, {
            ...finalParams,
            end_date: finalParams.is_current ? null : finalParams.end_date,
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

export default connect()(EducationItem);
