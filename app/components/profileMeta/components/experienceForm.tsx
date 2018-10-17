import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseInput from "../../common/scinapseInput";
import Checkbox from "@material-ui/core/Checkbox";
import ScinapseButton from "../../common/scinapseButton";
import { Profile } from "../../../model/profile";
import ProfileAPI from "../../../api/profile";
import PlutoAxios from "../../../api/pluto";
import alertToast from "../../../helpers/makePlutoToastAction";
const styles = require("./form.scss");

interface ExperienceFormProps {
  toggleExperienceFormBox: () => void;
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
          <label>Position</label>
          <ScinapseInput
            value={position}
            placeholder=""
            onChange={e => {
              this.handleChangeInput(e, "position");
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
            placeholder="2018"
          />
          <ScinapseInput
            value={beforeTimePeriodMonth}
            placeholder="10"
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
      position,
      beforeTimePeriodYear,
      beforeTimePeriodMonth,
      afterTimePeriodYear,
      afterTimePeriodMonth,
      currentlyIn,
    } = this.state;

    e.preventDefault();

    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));

      await ProfileAPI.postExperience({
        position,
        department,
        institution,
        isCurrent: currentlyIn,
        profileId: profile.id,
        endDate: `${afterTimePeriodYear}-${afterTimePeriodMonth}`,
        startDate: `${beforeTimePeriodYear}-${beforeTimePeriodMonth}`,
      });

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
      return <span>Current</span>;
    }

    return (
      <div>
        <ScinapseInput
          value={afterTimePeriodYear}
          onChange={e => {
            this.handleChangeInput(e, "afterTimePeriodYear");
          }}
          placeholder="2018"
        />
        <ScinapseInput
          value={afterTimePeriodMonth}
          placeholder="10"
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
