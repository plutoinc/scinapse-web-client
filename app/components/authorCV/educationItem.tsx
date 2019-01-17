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
    const { education } = this.props;
    const { isEditMode } = this.state;
    const { id, degree, department, startDate, endDate, isCurrent, institutionName, institutionId } = education;
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
          isCurrent,
          institutionId,
          institutionName,
          startDate,
          endDate,
          startDateYear: startDate.split("-")[0],
          startDateMonth: startDate.split("-")[1],
          endDateYear: endDate ? endDate.split("-")[0] : "",
          endDateMonth: endDate ? endDate.split("-")[1] : "",
        }}
      />
    ) : (
      <div className={styles.itemWrapper}>
        <div className={styles.dateSectionWrapper}>
          <span className={styles.dateContent}>{format(startDate, "MMM YYYY")}</span>
          <span className={styles.dateContent}>- {endDate ? format(endDate, "MMM YYYY") : "Present"}</span>
        </div>
        <div className={styles.contentWrapper}>
          {this.getEditItemButtons(id)}
          <span className={styles.affiliationContent}>{institutionName}</span>
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
      startDate: getFormattingDate(params.startDateYear, params.startDateMonth),
      endDate: getFormattingDate(params.endDateYear, params.endDateMonth),
    };

    try {
      finalParams.id &&
        (await dispatch(
          updateAuthorCvInfo("educations", authorId, {
            ...finalParams,
            endDate: finalParams.isCurrent ? null : finalParams.endDate,
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
