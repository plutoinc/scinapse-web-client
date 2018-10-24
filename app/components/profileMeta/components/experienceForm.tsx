import * as React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { ProfileMetaEnum } from "..";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseInput from "../../common/scinapseInput";
import ScinapseButton from "../../common/scinapseButton";
import { Profile, Education, Experience, Award } from "../../../model/profile";
import ProfileAPI from "../../../api/profile";
import PlutoAxios from "../../../api/pluto";
import alertToast from "../../../helpers/makePlutoToastAction";
import { validateDateString, validateLength } from "../helpers/validateDateString";
const styles = require("./form.scss");

interface ExperienceFormProps {
  toggleExperienceFormBox: () => void;
  handleAddMetaItem: (profileMetaType: ProfileMetaEnum, meta: Education | Experience | Award) => void;
  profile: Profile;
}

interface ExperienceFormFields {
  institution: string;
  department: string;
  position: string;
  beforeTimePeriodYear: string;
  beforeTimePeriodMonth: string;
  afterTimePeriodYear: string;
  afterTimePeriodMonth: string; // yyyy-MM
}

interface ExperienceFormState extends ExperienceFormFields {
  currentlyIn: boolean;
  isLoading: boolean;
}

const experienceFormInitialState: ExperienceFormState = {
  institution: "",
  department: "",
  position: "",
  beforeTimePeriodYear: "",
  beforeTimePeriodMonth: "",
  afterTimePeriodYear: "",
  afterTimePeriodMonth: "", // yyyy-MM
  currentlyIn: false,
  isLoading: false,
};

const formInputStyle: React.CSSProperties = {
  paddingRight: "8px",
  width: "400px",
  backgroundColor: "#fff",
};

const yearInputFormStyle: React.CSSProperties = {
  paddingRight: "8px",
  width: "72px",
  backgroundColor: "#fff",
  textAlign: "center",
  marginRight: "8px",
};

@withStyles<typeof ExperienceForm>(styles)
class ExperienceForm extends React.PureComponent<ExperienceFormProps, ExperienceFormState> {
  public constructor(props: ExperienceFormProps) {
    super(props);

    this.state = experienceFormInitialState;
  }

  public render() {
    const {
      institution,
      department,
      position,
      beforeTimePeriodYear,
      beforeTimePeriodMonth,
      currentlyIn,
      isLoading,
    } = this.state;

    return (
      <div className={styles.formContainer}>
        <div className={styles.formControl}>
          <label>Institution</label>
          <div className={styles.inputContainer}>
            <ScinapseInput
              onChange={e => {
                this.handleChangeInput(e, "institution");
              }}
              value={institution}
              placeholder=""
              inputStyle={formInputStyle}
            />
          </div>
        </div>
        <div className={styles.formControl}>
          <label>Department</label>
          <div className={styles.inputContainer}>
            <ScinapseInput
              onChange={e => {
                this.handleChangeInput(e, "department");
              }}
              value={department}
              placeholder=""
              inputStyle={formInputStyle}
            />
          </div>
        </div>
        <div className={styles.formControl}>
          <label>Position</label>
          <div className={styles.inputContainer}>
            <ScinapseInput
              value={position}
              placeholder=""
              inputStyle={formInputStyle}
              onChange={e => {
                this.handleChangeInput(e, "position");
              }}
            />
          </div>
        </div>
        <div className={styles.formControl}>
          <label>Time Period</label>
          <div className={styles.inputContainer}>
            <ScinapseInput
              value={beforeTimePeriodYear}
              onChange={e => {
                this.handleChangeInput(e, "beforeTimePeriodYear");
              }}
              placeholder="YYYY"
              inputStyle={yearInputFormStyle}
            />
            <ScinapseInput
              value={beforeTimePeriodMonth}
              placeholder="MM"
              inputStyle={yearInputFormStyle}
              onChange={e => {
                this.handleChangeInput(e, "beforeTimePeriodMonth");
              }}
            />
            <span className={styles.periodText}> - </span>
            {this.getAfterPeriod()}
            <Checkbox onChange={this.handleToggleCheckbox} checked={currentlyIn} color="default" />
            <span className={styles.periodText}>Current</span>
          </div>
        </div>

        {/* TODO: Change below GA category as trackable one. */}
        <div className={styles.buttonWrapper}>
          <div className={styles.formButton}>
            <ScinapseButton
              style={{
                color: "#1e2a35",
                opacity: 0.25,
                width: "64px",
                height: "32px",
              }}
              gaCategory="ProfileMetaSetup"
              content="Cancel"
              onClick={this.handleToggleBox}
            />
          </div>
          <div className={styles.formButton}>
            <ScinapseButton
              style={{
                backgroundColor: isLoading ? "#9aa3b5" : "#48d2a0",
                cursor: isLoading ? "not-allowed" : "pointer",
                width: "64px",
                height: "32px",
              }}
              gaCategory="ProfileMetaSetup"
              content="Save"
              onClick={this.handleClickSaveButton}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  private handleClickSaveButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { profile, handleAddMetaItem } = this.props;
    const {
      institution,
      department,
      position,
      beforeTimePeriodYear,
      beforeTimePeriodMonth,
      afterTimePeriodYear,
      afterTimePeriodMonth,
      currentlyIn,
    } = this.state;
    e.preventDefault();

    try {
      validateLength({ value: institution, maxLength: 200, fieldName: "Institution" });
      validateLength({ value: department, maxLength: 100, fieldName: "Department" });
      validateLength({ value: position, maxLength: 100, fieldName: "Position" });
      validateDateString(beforeTimePeriodYear, "year");
      validateDateString(beforeTimePeriodMonth, "month");
      if (!currentlyIn) {
        validateDateString(afterTimePeriodYear, "year");
        validateDateString(afterTimePeriodMonth, "month");
      }

      this.setState(prevState => ({ ...prevState, isLoading: true }));

      const res = await ProfileAPI.postExperience({
        position,
        department,
        institution,
        isCurrent: currentlyIn,
        profileId: profile.id,
        startDate: `${beforeTimePeriodYear}-${beforeTimePeriodMonth}`,
        endDate: currentlyIn ? null : `${beforeTimePeriodYear}-${beforeTimePeriodMonth}`,
      });

      handleAddMetaItem(ProfileMetaEnum.EXPERIENCE, res.data.content);

      this.setState(_prevState => experienceFormInitialState);
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);

      alertToast({
        type: "error",
        message: error.message,
      });

      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  private handleToggleBox = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { toggleExperienceFormBox } = this.props;
    e.preventDefault();
    toggleExperienceFormBox();
  };

  private getAfterPeriod = () => {
    const { currentlyIn, afterTimePeriodMonth, afterTimePeriodYear } = this.state;

    if (currentlyIn) {
      return <span className={styles.periodText}>Current</span>;
    }

    return (
      <div className={styles.inputContainer}>
        <ScinapseInput
          value={afterTimePeriodYear}
          onChange={e => {
            this.handleChangeInput(e, "afterTimePeriodYear");
          }}
          placeholder="YYYY"
          inputStyle={yearInputFormStyle}
        />
        <ScinapseInput
          value={afterTimePeriodMonth}
          placeholder="MM"
          inputStyle={yearInputFormStyle}
          onChange={e => {
            this.handleChangeInput(e, "afterTimePeriodMonth");
          }}
        />
      </div>
    );
  };

  private handleToggleCheckbox = () => {
    const { currentlyIn } = this.state;

    this.setState(prevState => ({ ...prevState, currentlyIn: !currentlyIn }));
  };

  private handleChangeInput = (e: React.FormEvent<HTMLInputElement>, target: keyof ExperienceFormFields) => {
    const newValue = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, [`${target}`]: newValue }));
  };
}

export default ExperienceForm;
