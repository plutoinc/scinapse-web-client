import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseInput from "../../common/scinapseInput";
import Checkbox from "@material-ui/core/Checkbox";
import ScinapseButton from "../../common/scinapseButton";
import { Profile } from "../../../model/profile";
import ProfileAPI from "../../../api/profile";
import PlutoAxios from "../../../api/pluto";
import alertToast from "../../../helpers/__mocks__/makePlutoToastAction";
const styles = require("./form.scss");

interface EducationFormProps {
  toggleEducationFormBox: () => void;
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
      <div>
        <div className={styles.formControl}>
          <label>Institution</label>
          <ScinapseInput
            onChange={e => {
              this.handleChangeInput(e, "institution");
            }}
            value={institution}
            placeholder=""
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
          />
        </div>
        <div className={styles.formControl}>
          <label>Degree</label>
          <ScinapseInput
            value={degree}
            placeholder=""
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
            placeholder=""
          />
          <ScinapseInput
            value={beforeTimePeriodMonth}
            placeholder=""
            onChange={e => {
              this.handleChangeInput(e, "beforeTimePeriodMonth");
            }}
          />
          <span> - </span>
          {this.getAfterPeriod()}
          <Checkbox onChange={this.handleToggleCheckbox} checked={currentlyIn} />
          <span>Current Student</span>
        </div>
        {/* TODO: Change below GA category as trackable one. */}
        <ScinapseButton
          style={{ color: "#1e2a35", opacity: 0.25 }}
          gaCategory="ProfileMetaSetup"
          content="Cancel"
          onClick={this.handleToggleBox}
        />
        <ScinapseButton
          style={{ backgroundColor: isLoading ? "#9aa3b5" : "#48d2a0", cursor: isLoading ? "not-allowed" : "pointer" }}
          gaCategory="ProfileMetaSetup"
          content="Save"
          onClick={this.handleClickSaveButton}
          disabled={isLoading}
        />
      </div>
    );
  }

  private handleClickSaveButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { profile } = this.props;
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
      await ProfileAPI.postEducation({
        degree,
        department,
        institution,
        isCurrent: currentlyIn,
        profileId: profile.id,
        endDate: `${afterTimePeriodYear}-${afterTimePeriodMonth}`,
        startDate: `${beforeTimePeriodYear}-${beforeTimePeriodMonth}`,
      });

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
      return <span>Current</span>;
    }

    return (
      <div>
        <ScinapseInput
          value={afterTimePeriodYear}
          onChange={e => {
            this.handleChangeInput(e, "afterTimePeriodYear");
          }}
          placeholder=""
        />
        <ScinapseInput
          value={afterTimePeriodMonth}
          placeholder=""
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
