import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseInput from "../../common/scinapseInput";
import Checkbox from "@material-ui/core/Checkbox";
import ScinapseButton from "../../common/scinapseButton";
import { Profile, Award, Experience, Education } from "../../../model/profile";
import ProfileAPI from "../../../api/profile";
import PlutoAxios from "../../../api/pluto";
import alertToast from "../../../helpers/makePlutoToastAction";
import { ProfileMetaEnum } from "..";
const styles = require("./form.scss");

interface EducationFormProps {
  toggleEducationFormBox: () => void;
  handleAddMetaItem: (profileMetaType: ProfileMetaEnum, meta: Education | Experience | Award) => void;
  profile: Profile;
}

interface EducationFormFields {
  institution: string;
  department: string;
  degree: string;
  beforeTimePeriodYear: string;
  beforeTimePeriodMonth: string;
  afterTimePeriodYear: string;
  afterTimePeriodMonth: string; // yyyy-MM
}

interface EducationFormState extends EducationFormFields {
  currentlyIn: boolean;
  isLoading: boolean;
}

const educationFormInitialState: EducationFormState = {
  institution: "",
  department: "",
  degree: "",
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

@withStyles<typeof EducationForm>(styles)
class EducationForm extends React.PureComponent<EducationFormProps, EducationFormState> {
  public constructor(props: EducationFormProps) {
    super(props);

    this.state = educationFormInitialState;
  }

  public render() {
    const {
      institution,
      department,
      degree,
      beforeTimePeriodYear,
      beforeTimePeriodMonth,
      currentlyIn,
      isLoading,
    } = this.state;

    return (
      <div className={styles.formContainer}>
        <div className={styles.formControl}>
          <label>Institution</label>
          <ScinapseInput
            onChange={e => {
              this.handleChangeInput(e, "institution");
            }}
            value={institution}
            placeholder=""
            inputStyle={formInputStyle}
          />
        </div>
        <div className={styles.formControl}>
          <label>Department</label>
          <ScinapseInput
            onChange={e => {
              this.handleChangeInput(e, "department");
            }}
            value={department}
            placeholder=""
            inputStyle={formInputStyle}
          />
        </div>
        <div className={styles.formControl}>
          <label>Degree</label>
          <ScinapseInput
            value={degree}
            placeholder=""
            inputStyle={formInputStyle}
            onChange={e => {
              this.handleChangeInput(e, "degree");
            }}
          />
        </div>
        <div className={styles.formControl}>
          <label>Time Period</label>
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
          <span className={styles.periodText}>Current Student</span>
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
      degree,
      beforeTimePeriodYear,
      beforeTimePeriodMonth,
      afterTimePeriodYear,
      afterTimePeriodMonth,
      currentlyIn,
    } = this.state;

    e.preventDefault();

    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const res = await ProfileAPI.postEducation({
        degree,
        department,
        institution,
        isCurrent: currentlyIn,
        profileId: profile.id,
        endDate: `${afterTimePeriodYear}-${afterTimePeriodMonth}`,
        startDate: `${beforeTimePeriodYear}-${beforeTimePeriodMonth}`,
      });

      handleAddMetaItem(ProfileMetaEnum.EDUCATION, res.data.content);

      this.setState(_prevState => educationFormInitialState);
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
    const { toggleEducationFormBox } = this.props;
    e.preventDefault();
    toggleEducationFormBox();
  };

  private getAfterPeriod = () => {
    const { currentlyIn, afterTimePeriodMonth, afterTimePeriodYear } = this.state;

    if (currentlyIn) {
      return <span className={styles.periodText}> Current </span>;
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

  private handleChangeInput = (e: React.FormEvent<HTMLInputElement>, target: keyof EducationFormFields) => {
    const newValue = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, [`${target}`]: newValue }));
  };
}

export default EducationForm;
