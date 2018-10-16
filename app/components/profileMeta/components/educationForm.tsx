import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseInput from "../../common/scinapseInput";
import Checkbox from "@material-ui/core/Checkbox";
import ScinapseButton from "../../common/scinapseButton";
const styles = require("./form.scss");

interface EducationFormProps {
  toggleEducationFormBox: () => void;
}

interface EducationFormState {
  institution: string;
  department: string;
  degree: string;
  beforeTimePeriodYear: string;
  beforeTimePeriodMonth: string;
  afterTimePeriodYear: string;
  afterTimePeriodMonth: string; // yyyy-MM
  currentlyIn: boolean;
}

@withStyles<typeof EducationForm>(styles)
class EducationForm extends React.PureComponent<EducationFormProps, EducationFormState> {
  public constructor(props: EducationFormProps) {
    super(props);

    this.state = {
      institution: "",
      department: "",
      degree: "",
      beforeTimePeriodYear: "",
      beforeTimePeriodMonth: "",
      afterTimePeriodYear: "",
      afterTimePeriodMonth: "", // yyyy-MM
      currentlyIn: false,
    };
  }

  public render() {
    const { institution, department, degree, beforeTimePeriodYear, beforeTimePeriodMonth, currentlyIn } = this.state;

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
        <ScinapseButton gaCategory="ProfileMetaSetup" buttonText="Cancel" onClick={this.handleToggleBox} />
        <ScinapseButton gaCategory="ProfileMetaSetup" buttonText="Save" onClick={this.handleClickSaveButton} />
      </div>
    );
  }

  private handleClickSaveButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // TODO: Fill this logic
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

  private handleChangeInput = (e: React.FormEvent<HTMLInputElement>, target: keyof EducationFormState) => {
    const newValue = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, [`${target}`]: newValue }));
  };
}

export default EducationForm;
