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
    const { experience } = this.props;
    const { isEditMode } = this.state;
    const {
      id,
      position,
      department,
      description,
      startDate: startDate,
      endDate: endDate,
      institutionId: institutionId,
      institutionName: institutionName,
      isCurrent: isCurrent,
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
        handleClose={this.handelToggleExperienceEditForm}
        isOpen={true}
        isLoading={false}
        handleSubmitForm={this.handelUpdateExperience}
        initialValues={{
          id,
          department,
          description,
          position,
          institutionId,
          institutionName,
          isCurrent,
          startDate,
          endDate,
        }}
      />
    ) : (
      <div className={styles.itemWrapper}>
        <div className={styles.dateSectionWrapper}>
          <span className={styles.dateContent}>{startDate}</span>
          <span className={styles.dateContent}>- {endDate ? endDate : "Present"}</span>
        </div>
        <div className={styles.contentWrapper}>
          {this.getEditItemButtons(id)}
          <span className={styles.affiliationContent}>{position}</span>
          <span className={styles.subAffiliationContent}>
            {institutionName}, {department}
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

    try {
      await dispatch(
        updateAuthorCvInfo("experiences", authorId, {
          ...params,
          endDate: params.isCurrent ? null : params.endDate,
        })
      );
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
