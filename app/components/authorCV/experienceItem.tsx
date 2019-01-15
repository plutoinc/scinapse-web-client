import * as React from "react";
import { Dispatch, connect } from "react-redux";
import * as format from "date-fns/format";
import { Experience } from "../../model/profile";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import ExperienceForm, { ExperienceFormState } from "./experienceForm";
import PlutoAxios from "../../api/pluto";
import alertToast from "../../helpers/makePlutoToastAction";
import { updateAuthorCvInfo } from "../../actions/author";
import { getFormattingDate, getMonthOptionItems } from "../../containers/authorCvSection";
const styles = require("./authorCVItem.scss");

interface ExperienceItemState {
  isEditMode: boolean;
}

interface ExperienceItemProps {
  validConnection: boolean;
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
        wrapperStyle={{ display: "inline-flex", position: "relative" }}
        inputStyle={{
          color: "#666d7c",
          fontSize: "13px",
          lineHeight: "1.54",
          fontFamily: "Roboto",
          padding: "8px",
        }}
        monthItems={getMonthOptionItems()}
        handleClose={this.handelToggleExperienceEditForm}
        isOpen={true}
        isLoading={false}
        handleSubmitForm={this.handelUpdateExperience}
        initialValues={{
          id,
          department,
          description,
          position,
          institution_id,
          institution_name,
          is_current,
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
          <span className={styles.affiliationContent}>{position}</span>
          <span className={styles.subAffiliationContent}>
            {institution_name}, {department}
          </span>
          <span className={styles.detailDescriptionSection}>{description}</span>
        </div>
      </div>
    );
  }

  private getEditItemButtons = (id: string) => {
    const { validConnection, handleRemoveItem } = this.props;

    if (validConnection) {
      return (
        <div className={styles.hoverButtonWrapper}>
          <span className={styles.hoverEditButton} onClick={this.handelToggleExperienceEditForm}>
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

  private handelToggleExperienceEditForm = () => {
    const { isEditMode } = this.state;

    this.setState({ isEditMode: !isEditMode });
  };

  private handelUpdateExperience = async (params: ExperienceFormState) => {
    const { dispatch, authorId } = this.props;

    const finalParams = {
      ...params,
      start_date: getFormattingDate(params.start_date_year, params.start_date_month),
      end_date: getFormattingDate(params.end_date_year, params.end_date_month),
    };

    try {
      finalParams.id &&
        (await dispatch(
          updateAuthorCvInfo("experiences", authorId, {
            ...finalParams,
            end_date: finalParams.is_current ? null : finalParams.end_date,
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

export default connect()(ExperienceItem);
